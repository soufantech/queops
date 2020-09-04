import { QueryFilterInput } from '../query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export function createMaxNumberValidationMiddleware(
  maxNumber: number,
): QueryFilterMiddleware<number> {
  return (filterInput: QueryFilterInput<number>) => {
    if (filterInput.operand > maxNumber) {
      return undefined;
    }

    return filterInput;
  };
}
