import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import { createOperatorAllowlistMiddleware } from './query-filter-middleware';
import {
  QueryBuilderInterface,
  LogicalComparisonOperator,
} from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

const LOGICAL_COMPARISON_OPERATORS: readonly LogicalComparisonOperator[] = [
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

export class LogicalComparisonQueryFilter<
  TOperand = unknown
> extends MiddlewaredQueryFilter<TOperand> {
  public constructor() {
    super(PRESET_MIDDLEWARES);
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
