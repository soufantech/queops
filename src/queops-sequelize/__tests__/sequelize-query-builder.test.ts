import { Bar, sync, populate, Review } from './database';
import { QuerystringProcessor, Q } from '../../queops';
import { createSequelizeQueryBuilder } from '../sequelize-query-builder';
import util from 'util';

beforeAll(async () => {
  await sync();
  await populate();
});

function inspect(a: unknown) {
  console.log(util.inspect(a, false, 40, true));
}

function toJson(a: unknown): string {
  return JSON.stringify(a, null, 2);
}

const processor = new QuerystringProcessor({
  name: Q.equalString({
    bindingName: 'name',
  }),
  stars: [Q.rangeInt(), Q.queryOrder()],
  exclude: Q.queryExclude({
    minElements: 1,
    acceptedElements: Object.keys(Bar.rawAttributes),
  }),
  parking: Q.equalBool(),
  limit: Q.queryLimit(),
  offset: Q.queryOffset(),
  search: Q.querySearch(),
  populate: Q.queryPopulate({ acceptedElements: ['reviews'] }),
});

// setup
const queryBuilder = createSequelizeQueryBuilder({
  searches: {
    search: ['city', 'region'],
  },
  populators: {
    reviews: () => {
      return {
        model: Review,
        as: 'reviews',
        attributes: ['comment', 'postedAt'],
      };
    },
  },
});

const QUERY_STRING = `\
stars=desc:1&\
stars=bet:0..10&\
exclude=updatedAt&\
populate=reviews&\
search=leste&\
noop=yes`;

test('query builder', async () => {
  // per-request...

  // controller
  const { action, notices } = processor.process(QUERY_STRING);

  const query = queryBuilder.build(action, {
    limit: 100,
  });

  inspect({
    query,
    notices,
  });

  const result = await Bar.findAll(query);

  console.log(toJson(result));
});
