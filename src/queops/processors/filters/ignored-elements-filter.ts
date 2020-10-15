import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success } from '../../result';
import { createOperandFilter } from './operand-filter';

export function createIgnoredElementsFilter<TOperand extends unknown[]>(
  ignoredElements: TOperand,
): Filter<TOperand, OperatorSuperType> {
  return createOperandFilter<TOperand>((operand: TOperand) => {
    const filteredElements = operand.filter(
      (o) => !ignoredElements.includes(o),
    );

    return success(filteredElements as TOperand);
  });
}
