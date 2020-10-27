import { populate, sync, Bar } from './database';
import { QuerySchema, Q } from '../../queops';
import { createBuilder } from '../sequelize-query-builder';

beforeAll(async () => {
  await sync();
  await populate();
});

test('query attributes are disjunctive (AND logic).', async () => {
  const QUERY_STR = 'area=s&city=Juiz de Fora&stars=eq:2&';

  const builder = createBuilder({
    searches: {
      area: ['city', 'region'],
    },
  });

  const schema = new QuerySchema({
    city: Q.equalString(),
    stars: Q.logicalInt(),
    area: Q.querySearch(),
  });

  const { notices, action } = schema.process(QUERY_STR);

  const findOptions = builder.build(action);

  const results = await Bar.findAll(findOptions);

  expect(results).toContainEqual(
    expect.objectContaining({
      stars: 2,
      city: 'Juiz de Fora',
      region: expect.stringContaining('s'),
    }),
  );

  expect(notices.length).toBe(0);
});
