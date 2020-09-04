import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import { QueryBuilderInterface } from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

export class ExcludeFieldsQueryFilter extends MiddlewaredQueryFilter<string[]> {
  public getDispatcher({
    operand,
  }: QueryFilterInput<string[]>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.excludeFields(operand);
    };
  }
}
