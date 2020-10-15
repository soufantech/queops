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
        `Number of elements violates maximum limit of ${maxElements}`,
      );
    }

    return success(operand);
  });
}
