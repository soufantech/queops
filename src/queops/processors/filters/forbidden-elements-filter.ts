import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperandFilter } from './operand-filter';

function formatViolations(violations: unknown[]) {
  return violations.map((v) => `"${v}"`).join(', ');
}

export function createForbiddenElementsFilter<TOperand extends unknown[]>(
  forbiddenOperands: TOperand,
): Filter<TOperand, OperatorSuperType> {
  return createOperandFilter<TOperand>((operand: TOperand) => {
    const violations = operand.filter((o) => forbiddenOperands.includes(o));

    if (violations.length > 0) {
      return failure(
        `The following elements are not allowed to be in the list: ${formatViolations(
          violations,
        )}`,
      );
    }

    return success(operand);
  });
}
