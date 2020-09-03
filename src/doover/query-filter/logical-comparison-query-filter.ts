import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import {
  QueryFilterMiddleware,
  createOperatorAllowlistMiddleware,
} from './query-filter-middleware';
import {
  QueryBuilderInterface,
  LogicalComparisonOperator,
} from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

const LOGICAL_COMPARISON_OPERATORS: LogicalComparisonOperator[] = [
  'eq',
  'gte',
  'lte',
  'gt',
  'lt',
  'ne',
];

const PRESET_MIDDLEWARES = [
  createOperatorAllowlistMiddleware(LOGICAL_COMPARISON_OPERATORS),
];

export type LogicalComparisonQueryFilterOptions<TOperand = unknown> = {
  middlewares?: QueryFilterMiddleware<TOperand>;
};

export class LogicalComparisonQueryFilter<
  TOperand = unknown
> extends MiddlewaredQueryFilter<TOperand> {
  public constructor({
    middlewares,
  }: LogicalComparisonQueryFilterOptions<TOperand> = {}) {
    super(
      (PRESET_MIDDLEWARES as QueryFilterMiddleware<TOperand>[]).concat(
        middlewares ?? [],
      ),
    );
  }

  public getDispatcher({
    field,
    operand,
    operator,
  }: QueryFilterInput<TOperand>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.compareLogical<TOperand>(
        field,
        operand,
        operator as LogicalComparisonOperator,
      );
    };
  }
}
