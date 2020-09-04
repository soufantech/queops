import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import { QueryBuilderInterface } from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

export class IncludeFieldsQueryFilter extends MiddlewaredQueryFilter<string[]> {
  public getDispatcher({
    operand,
  }: QueryFilterInput<string[]>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.includeFields(operand);
    };
  }
}
