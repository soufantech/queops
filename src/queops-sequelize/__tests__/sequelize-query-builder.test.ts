import { Bar, populate, sync } from './database';
import * as show from './show';

beforeAll(async () => {
  await sync();
  await populate();
});

// const QUERY_STRING = `\
// `;

test('everything is working as expected.', async () => {
  const result = await Bar.findAll();

  show.json(result);
});
