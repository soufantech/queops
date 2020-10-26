import { Review, Bar, populate, sync } from './database';
import { QuerystringProcessor, Q } from '../../queops';
import { createBuilder } from '../sequelize-query-builder';
import { Includeable } from 'sequelize';

beforeAll(async () => {
  await sync();
  await populate();
});

const processor = new QuerystringProcessor({
  populate: Q.queryPopulate(),
});

test('populate will bring the associated data when populator name matches the name in querystring', async () => {
  const QUERY_STR = 'populate=nah,reviews';

  const queryBuilder = createBuilder({
    populators: {
      reviews: () => {
        return {
          model: Review,
          as: 'reviews',
        };
      },
    },
  });

  const { action, notices } = processor.process(QUERY_STR);

  const findOptions = queryBuilder.build(action);

  const result = await Bar.findAll(findOptions);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        reviews: expect.any(Array),
      }),
    ]),
  );

  expect(notices.length).toBe(0);
});

test('repeated populate names have no effect.', async () => {
  const QUERY_STR = 'populate=nah,reviews,reviews,nah,reviews';

  const queryBuilder = createBuilder({
    populators: {
      reviews: () => {
        return {
          model: Review,
          as: 'reviews',
        };
      },
    },
  });

  const { action, notices } = processor.process(QUERY_STR);

  const findOptions = queryBuilder.build(action); // findOptions has 3 includes though.

  const result = await Bar.findAll(findOptions);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        reviews: expect.any(Array),
      }),
    ]),
  );

  expect(notices.length).toBe(0);
});

test('populate will NOT bring the associated data when populator name does NOT match the name in querystring.', async () => {
  const QUERY_STR = 'populate=dummy,dummier';

  const queryBuilder = createBuilder({
    populators: {
      reviews: () => {
        return {
          model: Review,
          as: 'reviews',
        };
      },
    },
  });

  const { action, notices } = processor.process(QUERY_STR);

  const findOptions = queryBuilder.build(action);

  const result = await Bar.findAll(findOptions);

  expect(result).not.toContainEqual(
    expect.objectContaining({
      reviews: expect.anything(),
    }),
  );

  expect(notices.length).toBe(0);
});

test('populate will NOT bring the associated data when populate name is NOT present in querystring.', async () => {
  const QUERY_STR = 'noop=ah';

  const queryBuilder = createBuilder({
    populators: {
      reviews: () => {
        return {
          model: Review,
          as: 'reviews',
        };
      },
    },
  });

  const { action, notices } = processor.process(QUERY_STR);

  const findOptions = queryBuilder.build(action);

  const result = await Bar.findAll(findOptions);

  expect(result).not.toContainEqual(
    expect.objectContaining({
      reviews: expect.anything(),
    }),
  );

  expect(notices.length).toBe(0);
});

test('populate will NOT bring the associated data when populator name does NOT match the name in querystring.', async () => {
  const QUERY_STR = 'populate=dummy,dummier';

  const queryBuilder = createBuilder({
    populators: {
      reviews: () => {
        return {
          model: Review,
          as: 'reviews',
        };
      },
    },
  });

  const { action, notices } = processor.process(QUERY_STR);

  const findOptions = queryBuilder.build(action);

  const result = await Bar.findAll(findOptions);

  expect(result).not.toContainEqual(
    expect.objectContaining({
      reviews: expect.anything(),
    }),
  );

  expect(notices.length).toBe(0);
});

test('populate adds an entry to FindOptions.include if it already exists', async () => {
  const QUERY_STR = 'populate=reviews';

  const queryBuilder = createBuilder({
    populators: {
      reviews: () => {
        return {
          model: Review,
          as: 'reviews',
          limit: 2,
        };
      },
    },
  });

  const { action, notices } = processor.process(QUERY_STR);

  const findOptions = queryBuilder.build(action, {
    include: Review,
  });

  const findOptions2 = queryBuilder.build(action, {
    include: [Review],
  });

  const result = await Bar.findAll(findOptions);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        reviews: expect.any(Array),
      }),
    ]),
  );

  expect(findOptions.include).toEqual(expect.any(Array));
  expect((findOptions.include as Includeable[]).length).toBe(2);

  expect(findOptions2.include).toEqual(expect.any(Array));
  expect((findOptions2.include as Includeable[]).length).toBe(2);

  expect(notices.length).toBe(0);
});
