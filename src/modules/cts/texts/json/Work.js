import fs from 'fs';
import crypto from 'crypto';
import winston from 'winston';
import _s from 'underscore.string';

import { getCltkTextgroupUrn } from '../../lib/getCltkUrns';
import Language from '../../../../models/language';
import TextGroup from '../../../../models/textGroup';
import Work from '../../../../models/work';
import TextNode from './TextNode';



/** Class representing a work in a textgroup */
class _Work {

	/**
	 * Create a new work
	 */
	constructor({ text, urn, filename }) {
		this.text = text;
		this.urn = urn;
		this.original_title = text.originalTitle;
		this.english_title = text.englishTitle;
		this.filename = filename;
		this.filemd5hash = crypto.createHash('md5').update(fs.readFileSync(filename, 'utf8')).digest('hex');
		this.language = text.language;

		this.structure;
		this.form;
		this.exemplar;
		this.version;
		this.textNodes = [];
	}

	/**
	 * Generate the inventory of the textNodes in the work
	 */
	async generateInventory(collection) {
		winston.info(` -- --  -- generating inventory for work ${this.english_title}`);

		const jsonToTextNodes = (node, location = []) => {
			for (const key in node) {
				const _location = location.slice();
				_location.push(parseInt(key, 10));
				if (typeof node[key] === 'string') {
					this.textNodes.push(new TextNode({
						location: _location,
						text: node[key],
						filename: this.filename,
					}));
				} else {
					jsonToTextNodes(node[key], _location);
				}
			}
		};

		jsonToTextNodes(this.text.text);

		return await this.save(collection);
	}

	/**
	 * Save all work data and textnodes in the work
	 */
	async save(collection) {
		let textGroup = await TextGroup.findOne({
			where: {
				title: this.text.author,
			},
		});

		if (!textGroup) {
			textGroup = await TextGroup.create({
				title: this.language,
				urn: getCltkTextgroupUrn(collection.urn, this.text.author),
			});
		}

		const english_title = this.english_title;
		const original_title = this.original_title;
		if (!english_title || !original_title) {
			winston.error(`Error ingesting Work ${this.filename}`);
			return null;
		}

		const urn = this.urn || '';

		const work = await Work.create({
			filemd5hash: this.filemd5hash,
			filename: this.filename,
			original_title: original_title.slice(0, 255),
			english_title: english_title.slice(0, 255),
			structure: this.structure,
			form: this.form,
			urn: urn.slice(0, 255),
		});

		await work.setTextgroup(textGroup);
		await textGroup.addWork(work);

		await this._createLanguage(work);

		// ingest all textnodes
		for (let i = 0; i < this.textNodes.length; i++) {
			await this.textNodes[i].save(i);
		}
	}

	async _createLanguage(work) {

		let language;
		language = await Language.findOne({
			where: {
				title: _s.humanize(this.language),
			}
		});

		const _language = _s.humanize(this.language).trim();
		if (!language && _language.length) {
			language = await Language.create({
				title: _language,
			});

			await work.setLanguage(language);
			await language.addWork(work);
		}
	}
}


export default _Work;
