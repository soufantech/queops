import { QueryFilterInput } from '../query-filter-input';
import { QueryFilterMiddleware } from '../query-filter-middleware';

export function createOperatorAllowlistMiddleware<
  TOperator extends string,
  TOperand = unknown
>(operators: readonly TOperator[]): QueryFilterMiddleware<TOperand> {
  return (filterInput: QueryFilterInput<TOperand>) => {
    if (operators.includes(filterInput.operator as TOperator)) {
      console.log('if >>>', operators, filterInput);
      return filterInput;
    }

    console.log('nif >>>', operators, filterInput);

    return undefined;
  };
}
