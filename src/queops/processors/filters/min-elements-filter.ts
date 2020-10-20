import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperandFilter } from './operand-filter';

export function createMinElementsFilter<TOperand extends unknown[]>(
  minElements: number,
): Filter<TOperand, OperatorSuperType> {
  return createOperandFilter<TOperand>((operand: TOperand) => {
    if (operand.length < minElements) {
      return failure(
        `The number of elements in list (${operand.length}) is below the minimum allowed: ${minElements}`,
      );
    }

    return success(operand);
  });
}
