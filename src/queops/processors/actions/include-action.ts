import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { IncludeQuery } from '../../queries';

export function createIncludeAction(query: IncludeQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.queryInclude(query.field, query.operand);
  };
}
