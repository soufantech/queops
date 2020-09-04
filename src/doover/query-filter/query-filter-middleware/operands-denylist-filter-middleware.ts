import { QueryFilterInput } from '../query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export function createOperandsDenylistFilterMiddleware<TOperand = unknown>(
  deniedOperands: readonly TOperand[],
): QueryFilterMiddleware<TOperand[]> {
  return (
    filterInput: QueryFilterInput<TOperand[]>,
  ): QueryFilterInput<TOperand[]> | undefined => {
    const filteredOperands = filterInput.operand.filter(
      (operand) => !deniedOperands.includes(operand),
    );

    if (filteredOperands.length > 0) {
      return {
        ...filterInput,
        operand: filteredOperands,
      };
    }

    return undefined;
  };
}
