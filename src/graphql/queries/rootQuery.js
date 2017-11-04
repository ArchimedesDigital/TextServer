import { GraphQLObjectType } from 'graphql';

import authorFields from './authors';
import corpusFields from './collections';
import languageFields from './languages';
import textNodeFields from './textNodes';
import workFields from './works';
import countFields from './counts';

/**
 * Root Query
 * @type {GraphQLObjectType}
 */
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		...authorFields,
		...corpusFields,
		...languageFields,
		...textNodeFields,
		...workFields,
		...countFields,
	}
});

export default RootQuery;
