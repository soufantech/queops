import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { EqualQuery } from '../../queries';

export function createEqualAction<TOperand>(
  query: EqualQuery<TOperand>,
): QueryAction {
  return (subject: QueryBuilder) => {
    subject.whereEqual(query.field, query.operand);
  };
}
