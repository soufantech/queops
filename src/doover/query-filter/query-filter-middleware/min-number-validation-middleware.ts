import { QueryFilterInput } from '../query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export function createMinNumberValidationMiddleware(
  minNumber: number,
): QueryFilterMiddleware<number> {
  return (filterInput: QueryFilterInput<number>) => {
    if (filterInput.operand < minNumber) {
      return undefined;
    }

    return filterInput;
  };
}
