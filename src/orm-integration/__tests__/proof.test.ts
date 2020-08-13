import { AutoQueryBuilder } from '../auto-query-builder';
import {
  ContainableField,
  ScalarField,
  RangeableField,
  OrderableField,
  LimitField,
  OffsetField,
} from '../field-types';
import { inspect } from 'util';

const QUERY = `\
tags=in:kids,pets&\
tags=bsg:kids,pets&\
name=porto&\
name=order:desc&\
name=order:desc&\
name=order:asc&\
stars=order:asc&\
published_at=bet:2015-06..2020&\
published_at=order:desc&\
stars=7&\
stars=8&\
limit=25&\
offset=3&\
city=lisbon`;

test('AutoQueryBuilder proof', () => {
  const aqb = new AutoQueryBuilder({
    name: { type: [ScalarField.string(), new OrderableField()] },
    stars: {
      type: [
        ScalarField.int({ parserOptions: { max: 5, min: 1 } }),
        new OrderableField({ allowOnly: 'asc' }),
      ],
      alias: 'stars_scored',
    },
    published_at: { type: RangeableField.date(), alias: 'created_at' },
    tags: { type: ContainableField.string() },
    limit: { type: new LimitField({ parserOptions: { min: 1, max: 30 } }) },
    offset: { type: new OffsetField({ parserOptions: { min: 0 } }) },
  });

  const context = aqb.buildFromQueryString(QUERY);

  console.log(inspect(context, false, 40));
});
