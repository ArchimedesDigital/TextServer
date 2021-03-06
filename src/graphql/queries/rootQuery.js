import { GraphQLObjectType } from 'graphql';

import authorFields from './authors';
import collectionFields from './collections';
import languageFields from './languages';
import textGroupFields from './textGroups';
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
		...collectionFields,
		...textGroupFields,
		...textNodeFields,
		...languageFields,
		...workFields,
		...countFields,
	}
});

export default RootQuery;
