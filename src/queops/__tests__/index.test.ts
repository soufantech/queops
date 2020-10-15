import { MockQueryBuilder } from './query-builder';
import { Q, QuerystringProcessor } from '..';
import { inspect } from 'util';

const QUERY_STRING = `\
category=restaurants&\
include_fields=inc:category,stars,city&\
stars=gt:5&\
stars=asc:1&\
location=Juiz%20de%20Fora&\
search=desconto&\
available=bet:2020-01-20..2020-01-26T18:30&\
available=desc:2&\
include_fields=inc:category,stars,city&\
tags=in:kids,pets,parking&\
limit=100&\
offset=4`;

test('integration test', () => {
  const processor = new QuerystringProcessor({
    tags: Q.elementString({
      maxElements: 3,
    }),
    stars: [Q.logicalInt(), Q.queryOrder()],
    limit: Q.queryLimit({
      max: 40,
      defaultValue: 20,
    }),
    offset: Q.queryOffset(),
    available: [
      Q.rangeDate({
        permittedOperators: ['bet'],
      }),
      Q.queryOrder(),
    ],
    include_fields: Q.queryProject({
      forbiddenOperators: ['inc'],
      acceptedElements: ['stars', 'tags'],
    }),
    location: Q.querySearch({}),
  });

  const { action, notices } = processor.process(QUERY_STRING);

  console.log('notices:', inspect(notices, false, 20));

  const qb = new MockQueryBuilder();

  action(qb);

  console.log('query:', inspect(qb.getLogs(), false, 20));
});
