import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { LimitQuery } from '../../queries';

export function createLimitAction(query: LimitQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.queryLimit(query.field, query.operand);
  };
}
