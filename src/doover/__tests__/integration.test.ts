import { QueryBuilder } from './query-builder';
import {
  UrlQueryFiltersProcessor,
  RangeDateUrlQueryFilterHandler,
} from '../url-query-filter';
import { inspect } from 'util';

const QUERYSTR = 'birthdate=bet:2010..2020';

test('integration', () => {
  const qb = new QueryBuilder();

  const processor = new UrlQueryFiltersProcessor({
    birthdate: new RangeDateUrlQueryFilterHandler({ field: 'birthdate' }),
  });

  const success = processor.process(QUERYSTR, qb);

  console.log('>>> success:', success);
  console.log('>>> qb:', inspect(qb, false, 40));
});
