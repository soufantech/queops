import { MockQueryBuilder } from './query-builder';
import { Q, QuerystringProcessor } from '..';
import { inspect } from 'util';

const QUERY_STRING = `\
category=restaurants&\
include_fields=inc:category,stars,city&\
tags=in:kids,pets,parking&\
available=nbet:2020-01..2020-04&\
offset=4&\
limit=800`;

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
    include_fields: Q.queryInclude({
      acceptedElements: ['stars', 'tags'],
      bindingName: 'includeFields',
    }),
    location: Q.querySearch({}),
  });

  const { action, notices } = processor.process(QUERY_STRING);

  console.log('notices:', inspect(notices, false, 20));

  const qb = new MockQueryBuilder();

  action(qb);

  console.log('query:', inspect(qb.getLogs(), false, 20));
});
