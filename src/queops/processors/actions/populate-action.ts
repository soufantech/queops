import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { PopulateQuery } from '../../queries';

export function createPopulateAction(query: PopulateQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.queryPopulate(query.field, query.operand);
  };
}
