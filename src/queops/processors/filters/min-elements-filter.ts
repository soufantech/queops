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
        `Number of elements violates minimum limit of ${minElements}`,
      );
    }

    return success(operand);
  });
}
