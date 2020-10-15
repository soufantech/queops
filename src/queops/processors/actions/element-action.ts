import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { ElementQuery } from '../../queries';

export function createElementAction<TOperand>(
  query: ElementQuery<TOperand>,
): QueryAction {
  return (subject: QueryBuilder) => {
    subject.whereElement(query.field, query.operator, query.operand);
  };
}
