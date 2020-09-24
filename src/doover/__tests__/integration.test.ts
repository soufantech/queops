import { QueryBuilder } from './query-builder';
import { UriParamsProcessor, UriParam as Q } from '../uri-params-processor';
import { inspect } from 'util';

const QUERYSTR = `\
`;

test('integration', () => {
  const processor = new UriParamsProcessor({});

  const qb = new QueryBuilder();
  const success = processor.process(QUERYSTR, qb);

  console.log('>>> success:', success);
  console.log('>>> qb:', inspect(qb, false, 40));
});
