import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperandFilter } from './operand-filter';

function formatViolations(violations: unknown[]) {
  return violations.map((v) => `"${v}"`).join(', ');
}

export function createPermittedElementsFilter<TOperand extends unknown[]>(
  permittedOperands: TOperand,
): Filter<TOperand, OperatorSuperType> {
  return createOperandFilter<TOperand>((operand: TOperand) => {
    const violations = operand.filter((o) => !permittedOperands.includes(o));

    if (violations.length > 0) {
      return failure(
        `The following operands are not allowed: ${formatViolations(
          violations,
        )}`,
      );
    }

    return success(operand);
  });
}
