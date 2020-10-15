import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperandFilter } from './operand-filter';

export function createMinNumberFilter(
  minNumber: number,
): Filter<number, OperatorSuperType> {
  return createOperandFilter<number>((operand: number) => {
    if (operand <= minNumber) {
      return failure(`Operand "${operand}" exceeded minimum limit`);
    }

    return success(operand);
  });
}
