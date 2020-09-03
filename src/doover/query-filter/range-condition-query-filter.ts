import {
  MiddlewaredQueryFilter,
  MiddlewaredQueryFilterParams,
} from './middlewared-query-filter';
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

export class RangeConditionQueryFilter<
  TOperand = unknown
> extends MiddlewaredQueryFilter<TOperand[]> {
  public constructor({
    middlewares,
  }: MiddlewaredQueryFilterParams<TOperand[]> = {}) {
    super({
      middlewares: (PRESET_MIDDLEWARES as QueryFilterMiddleware<
        TOperand[]
      >[]).concat(middlewares ?? []),
    });
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
