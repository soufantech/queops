import { QueryBuilder } from './query-builder';
import { UriParamsProcessor, UriParam as Q } from '../uri-params-processor';
import { StrictComparisonQueryFilter } from '../query-filter';
import { inspect } from 'util';

const QUERYSTR = `\
birthdate=bet:2010..2020-10&\
stars=gt:aa&\
stars=ne:66&\
stars=gt:21&\
stars=52&\
ignore_me=please&\
tags=in:linux,foss,architecture&`;

test('integration', () => {
  const qb = new QueryBuilder();

  const processor = new UriParamsProcessor({
    birthdate: Q.rangeDate('birthdate').allowOperators('bet'),
    timeperiod: Q.rangeDate('timeperiod').defaultTo('nbet', [
      new Date(Date.now()),
      new Date(Date.now()),
    ]),
    tags: Q.elementString('searchTags'),
    stars: Q.logicalInt('stars').denyOperators('ne', 'eq'),
  });

  const success = processor.process(QUERYSTR, qb);

  qb.compareStrict('userId', 'asdf');

  const dispatcher = new StrictComparisonQueryFilter<string>().filter({
    field: 'userId2',
    operand: 'asdf2',
    operator: null,
  });

  dispatcher && dispatcher(qb);

  console.log('>>> success:', success);
  console.log('>>> qb:', inspect(qb, false, 40));
});
