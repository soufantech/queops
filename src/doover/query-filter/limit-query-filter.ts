import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import { QueryBuilderInterface } from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from '.';

export class LimitQueryFilter extends MiddlewaredQueryFilter<number> {
  public getDispatcher({
    operand,
  }: QueryFilterInput<number>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.limit(operand);
    };
  }
}
