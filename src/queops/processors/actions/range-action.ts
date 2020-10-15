import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { RangeQuery } from '../../queries';

export function createRangeAction<TOperand>(
  query: RangeQuery<TOperand>,
): QueryAction {
  return (subject: QueryBuilder) => {
    subject.whereRange(query.field, query.operator, query.operand);
  };
}
