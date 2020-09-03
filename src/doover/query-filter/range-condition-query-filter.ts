import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import {
  QueryFilterMiddleware,
  createOperatorAllowlistMiddleware,
} from './query-filter-middleware';
import {
  QueryBuilderInterface,
  RangeComparisonOperator,
} from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

const RANGE_CONDITION_QF_OPERATORS: RangeComparisonOperator[] = ['bet', 'nbet'];

const PRESET_MIDDLEWARES = [
  createOperatorAllowlistMiddleware(RANGE_CONDITION_QF_OPERATORS),
];

export type RangeConditionQueryFilterOptions<TOperand = unknown> = {
  middlewares?: QueryFilterMiddleware<TOperand>;
};

export class RangeConditionQueryFilter<
  TOperand = unknown
> extends MiddlewaredQueryFilter<TOperand[]> {
  public constructor({
    middlewares,
  }: RangeConditionQueryFilterOptions<TOperand[]> = {}) {
    super(
      (PRESET_MIDDLEWARES as QueryFilterMiddleware<TOperand[]>[]).concat(
        middlewares ?? [],
      ),
    );
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
