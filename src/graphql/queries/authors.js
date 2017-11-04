import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import AuthorType from '../types/author';
import AuthorService from '../logic/authors';

const authorFields = {
	authors: {
		type: new GraphQLList(AuthorType),
		args: {
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { limit, offset, }, { token }) {
			const authorService = new AuthorService(token);
			return await authorService.getAuthors(limit, offset);
		},
	},
	author: {
		type: AuthorType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug }, { token }) {
			const authorService = new AuthorService(token);
			return await authorService.getAuthor(id, slug);
		},
	},
};

export default authorFields;