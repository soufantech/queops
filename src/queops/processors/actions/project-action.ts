import { QueryAction } from '../../query-processor';
import { QueryBuilder } from '../../query-builder';
import { ProjectQuery } from '../../queries';

export function createProjectAction(query: ProjectQuery): QueryAction {
  return (subject: QueryBuilder) => {
    subject.queryProject(query.field, query.operator, query.operand);
  };
}
