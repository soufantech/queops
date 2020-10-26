import { Review, Bar, populate, sync } from './database';
import * as show from './show';
import { QuerystringProcessor, Q } from '../../queops';
import { createBuilder } from '../sequelize-query-builder';
import { decode } from 'querystring';

beforeAll(async () => {
  await sync();
  await populate();
});

const QUERY_STRING = `\
noop=true&\
stars=gt:5&\
`;

// setup
const processor = new QuerystringProcessor({
  region: Q.elementString({
    maxElements: 3,
    separator: ';',
  }),
  stars: [
    Q.rangeInt({
      forbiddenOperators: ['nbet'],
    }),
    Q.logicalInt(),
    Q.queryOrder(),
  ],
  exclude: Q.queryExclude({
    acceptedElements: Object.keys(Bar.rawAttributes),
    minElements: 1,
    maxElements: Object.keys(Bar.rawAttributes).length,
  }),
  area: Q.querySearch(),
  populate: Q.queryPopulate(),
});

// setup
const queryBuilder = createBuilder({
  searches: {
    area: ['region', 'city'],
  },
  populators: {
    reviews: () => {
      return {
        model: Review,
        as: 'reviews',
      };
    },
  },
});

test('everything is working as expected.', async () => {
  const queryDict = decode(QUERY_STRING);

  const { action, notices } = processor.process(queryDict);

  show.obj(notices);

  const query = queryBuilder.build(action, {});

  const result = await Bar.findAll(query);

  show.json(result);
});
