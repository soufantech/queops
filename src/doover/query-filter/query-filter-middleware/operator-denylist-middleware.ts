import { QueryFilterInput } from '../query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export function createOperatorDenylistMiddleware<
  TOperator extends QueryFilterInput['operator'],
  TOperand = unknown
>(operators: readonly TOperator[]): QueryFilterMiddleware<TOperand> {
  return <TOperand = unknown>(filterInput: QueryFilterInput<TOperand>) => {
    if (operators.includes(filterInput.operator as TOperator)) {
      return undefined;
    }

    return filterInput;
  };
}
