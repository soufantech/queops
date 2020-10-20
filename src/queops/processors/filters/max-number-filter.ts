import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperandFilter } from './operand-filter';

export function createMaxNumberFilter(
  maxNumber: number,
): Filter<number, OperatorSuperType> {
  return createOperandFilter<number>((operand: number) => {
    if (operand > maxNumber) {
      return failure(
        `The number operand "${operand}" must be lesser or equal ${maxNumber}`,
      );
    }

    return success(operand);
  });
}
