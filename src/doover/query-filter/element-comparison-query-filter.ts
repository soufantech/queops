import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import {
  QueryFilterMiddleware,
  createOperatorAllowlistMiddleware,
} from './query-filter-middleware';
import {
  QueryBuilderInterface,
  ElementComparisonOperator,
} from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

const ELEMENT_COMPARISON_OPERATORS: ElementComparisonOperator[] = ['in', 'nin'];

const PRESET_MIDDLEWARES = [
  createOperatorAllowlistMiddleware(ELEMENT_COMPARISON_OPERATORS),
];

export type ElementComparisonQueryFilterOptions<TOperand = unknown> = {
  middlewares?: QueryFilterMiddleware<TOperand>;
};

export class ElementComparisonQueryFilter<
  TOperand = unknown
> extends MiddlewaredQueryFilter<TOperand[]> {
  public constructor({
    middlewares,
  }: ElementComparisonQueryFilterOptions<TOperand[]> = {}) {
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
  }: QueryFilterInput<TOperand[]>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.compareElement<TOperand>(
        field,
        operand,
        operator as ElementComparisonOperator,
      );
    };
  }
}
