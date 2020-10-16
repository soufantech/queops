import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { ExcludeQuery } from '../../queries';

export function createExcludeAction(query: ExcludeQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.queryExclude(query.field, query.operand);
  };
}
