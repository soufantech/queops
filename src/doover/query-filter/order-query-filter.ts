import { MiddlewaredQueryFilter } from './middlewared-query-filter';
import { createOperatorAllowlistMiddleware } from './query-filter-middleware';
import {
  QueryBuilderInterface,
  OrderingOperator,
} from '../query-builder-interface';
import { QueryFilterInput, QueryBuilderDispatcher } from './query-filter';

const ORDERING_OPERATORS: readonly OrderingOperator[] = ['asc', 'desc'];

const PRESET_MIDDLEWARES = [
  createOperatorAllowlistMiddleware(ORDERING_OPERATORS),
];

export class OrderQueryFilter extends MiddlewaredQueryFilter<number> {
  public constructor() {
    super(PRESET_MIDDLEWARES);
  }

  public getDispatcher({
    field,
    operand,
    operator,
  }: QueryFilterInput<number>): QueryBuilderDispatcher {
    return (queryBuilder: QueryBuilderInterface) => {
      queryBuilder.order(field, operand, operator as OrderingOperator);
    };
  }
}
