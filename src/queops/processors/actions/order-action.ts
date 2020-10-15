import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { OrderQuery } from '../../queries';

export function createOrderAction(query: OrderQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.queryOrder(query.field, query.operator, query.operand);
  };
}
