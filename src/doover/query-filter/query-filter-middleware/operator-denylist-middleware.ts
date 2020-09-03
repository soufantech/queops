import { QueryFilterInput } from '../query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export function createOperatorDenylistMiddleware<
  TOperator extends string,
  TOperand = unknown
>(operators: readonly TOperator[]): QueryFilterMiddleware<TOperand> {
  return (filterInput: QueryFilterInput<TOperand>) => {
    if (operators.includes(filterInput.operator as TOperator)) {
      return undefined;
    }

    return filterInput;
  };
}
