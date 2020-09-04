import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import { createOperatorAllowlistMiddleware } from './query-filter-middleware';
import {
  QueryBuilderInterface,
  RangeComparisonOperator,
} from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

const RANGE_COMPARISON_OPERATORS: RangeComparisonOperator[] = ['bet', 'nbet'];

const PRESET_MIDDLEWARES = [
  createOperatorAllowlistMiddleware(RANGE_COMPARISON_OPERATORS),
];

export class RangeComparisonQueryFilter<
  TOperand = unknown
> extends MiddlewaredQueryFilter<TOperand[]> {
  public constructor() {
    super(PRESET_MIDDLEWARES);
  }

  public getDispatcher({
    field,
    operand,
    operator,
  }: QueryFilterInput<[TOperand, TOperand]>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.compareRange<TOperand>(
        field,
        operand,
        operator as RangeComparisonOperator,
      );
    };
  }
}
