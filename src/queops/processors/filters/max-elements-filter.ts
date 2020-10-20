import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperandFilter } from './operand-filter';

export function createMaxElementsFilter<TOperand extends unknown[]>(
  maxElements: number,
): Filter<TOperand, OperatorSuperType> {
  return createOperandFilter<TOperand>((operand: TOperand) => {
    if (operand.length > maxElements) {
      return failure(
        `The number of elements in list (${operand.length}) is above the maximum allowed: ${maxElements}`,
      );
    }

    return success(operand);
  });
}
