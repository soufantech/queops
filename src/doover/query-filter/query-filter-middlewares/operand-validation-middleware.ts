import { QueryFilterInput } from '../query-filter-input';
import { QueryFilterMiddleware } from '../query-filter-middleware';
import { Validator } from '../validator';

export function createOperandValidationMiddleware<TOperand = unknown>(
  validator: Validator,
): QueryFilterMiddleware<TOperand> {
  return (filterInput: QueryFilterInput<TOperand>) => {
    const { value, error } = validator.validate(filterInput.operand);

    if (error) {
      return undefined;
    }

    return {
      ...filterInput,
      operand: value,
    };
  };
}
