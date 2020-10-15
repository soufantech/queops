import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { SearchQuery } from '../../queries';

export function createSearchAction(query: SearchQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.querySearch(query.field, query.operand);
  };
}
