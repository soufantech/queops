import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { LogicalQuery } from '../../queries';

export function createLogicalAction<TOperand>(
  query: LogicalQuery<TOperand>,
): QueryAction {
  return (subject: QueryBuilder) => {
    subject.whereLogical<TOperand>(query.field, query.operator, query.operand);
  };
}
