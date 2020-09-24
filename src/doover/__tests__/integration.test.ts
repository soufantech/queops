import { QueryBuilder } from './query-builder';
import { UriParamsProcessor, UriParam as Q } from '../uri-params-processor';
import { inspect } from 'util';

const QUERYSTR = `\
offset=12&\
birthdate=bet:2010..2020-08&\
stars=gt:72&\
stars=lt:56&\
asdf=gasgsg&\
stars=asc:1&\
stars=aaa&\
limit=0&\
tags=in:restaurants,bars,parks&\
include=stars;birthdate;name&\
exclude=stars1&\
exclude=stars2&`;

// Ad-hoc query

test('integration', () => {
  const processor = new UriParamsProcessor({
    birthdate: Q.rangeDate('birthdate'),
    stars: [
      Q.logicalInt('score').denyOperators('ne'),
      Q.order('score').allowOperator('asc'),
    ],
    limit: Q.limit().defaultTo(100).max(200),
    offset: Q.offset(),
    include: Q.include({ separator: ';', maxElements: 30 }).accept(
      'stars',
      'birthdate',
    ),
    exclude: Q.exclude(),
    tags: Q.elementString('establishmentTags'),
  });

  const qb = new QueryBuilder();

  qb.compareStrict('userId', '13254257950025');

  const success = processor.process(QUERYSTR, qb);

  console.log('>>> success:', success);
  console.log('>>> qb:', inspect(qb, false, 40));
});
