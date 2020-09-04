import { QueryFilterInput } from '../query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export function createOperatorAllowlistMiddleware<
  TOperator extends QueryFilterInput['operator']
>(operators: readonly TOperator[]): QueryFilterMiddleware {
  return <TOperand = unknown>(filterInput: QueryFilterInput<TOperand>) => {
    if (operators.includes(filterInput.operator as TOperator)) {
      return filterInput;
    }

    return undefined;
  };
}
