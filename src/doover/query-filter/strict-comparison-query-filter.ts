import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import { QueryBuilderInterface } from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from '.';

export class StrictComparisonQueryFilter<
  TOperand = unknown
> extends MiddlewaredQueryFilter<TOperand> {
  public getDispatcher({
    field,
    operand,
  }: QueryFilterInput<TOperand>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.compareStrict<TOperand>(field, operand);
    };
  }
}
