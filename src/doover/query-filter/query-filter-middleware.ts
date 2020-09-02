import { QueryFilterInput } from './query-filter-input';

export interface QueryFilterMiddleware<TOperand = unknown> {
  (filterInput: QueryFilterInput<TOperand>):
    | QueryFilterInput<TOperand>
    | undefined;
}
