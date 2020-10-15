import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { OffsetQuery } from '../../queries';

export function createOffsetAction(query: OffsetQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.queryOffset(query.field, query.operand);
  };
}
