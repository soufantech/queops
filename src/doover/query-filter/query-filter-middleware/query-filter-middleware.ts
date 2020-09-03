import { QueryFilterInput } from '../query-filter';

export interface QueryFilterMiddleware<TOperand = unknown> {
  (filterInput: QueryFilterInput<TOperand>):
    | QueryFilterInput<TOperand>
    | undefined;
}
