import Sequelize from 'sequelize';
import db from '../db';

/**
 * A textnode (or passage) in a work
 */
const TextNode = db.define('textNodes', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	index: {
		type: Sequelize.INTEGER,
	},
	location: {
		type: Sequelize.ARRAY(Sequelize.INTEGER),
	},
	text: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
	tableName: 'textnodes',
});

TextNode.associate = ({ models }) => {
	TextNode.belongsTo(models.works);
};

export default TextNode;