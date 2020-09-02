import { MiddlewaredQueryFilter } from '../middlewared-query-filter';
import { QueryBuilderInterface } from '../../query-builder-interface';
import { QueryBuilderDispatcher } from '../query-builder-dispatcher';
import { QueryFilterInput } from '../query-filter-input';

export class StrictConditionQueryFilter<
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
