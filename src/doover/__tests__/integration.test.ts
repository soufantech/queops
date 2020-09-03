import { QueryBuilder } from './query-builder';
import {
  UrlQueryFiltersProcessor,
  RangeDateUrlQueryFilterHandler,
} from '../url-query-filter';
import { inspect } from 'util';

const QUERYSTR = 'birthdate=bet:2010..2020-10';

test('integration', () => {
  const qb = new QueryBuilder();

  const processor = new UrlQueryFiltersProcessor({
    birthdate: new RangeDateUrlQueryFilterHandler({
      field: 'birthdate',
    }).allowOperators('bet'),
    timeperiod: new RangeDateUrlQueryFilterHandler({
      field: 'timeperiod',
    }).defaultTo('nbet', [new Date(Date.now()), new Date(Date.now())]),
  });

  const success = processor.process(QUERYSTR, qb);

  console.log('>>> success:', success);
  console.log('>>> qb:', inspect(qb, false, 40));
});
