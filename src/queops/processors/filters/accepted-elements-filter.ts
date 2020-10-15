import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success } from '../../result';
import { createOperandFilter } from './operand-filter';

export function createAcceptedElementsFilter<TOperand extends unknown[]>(
  acceptedElements: TOperand,
): Filter<TOperand, OperatorSuperType> {
  return createOperandFilter<TOperand>((operand: TOperand) => {
    const filteredElements = operand.filter((o) =>
      acceptedElements.includes(o),
    );

    return success(filteredElements as TOperand);
  });
}
