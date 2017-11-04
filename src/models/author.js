import Sequelize from 'sequelize';
import db from '../db';

/**
 * An author of a work
 */
const Author = db.define('authors', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	english_name: {
		type: Sequelize.STRING,
	},
	original_name: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING,
		unique: true,
	},
}, {
	timestamps: false,
});


Author.associate = ({ models }) => {
	Author.hasMany(models.works);
};



export default Author;