import { QueryFilterInput } from '../query-filter';

export interface QueryFilterMiddleware<TOperand = unknown> {
  (filterInput: QueryFilterInput<TOperand>):
    | QueryFilterInput<TOperand>
    | undefined;
  <TOperand2 = unknown>(filterInput: QueryFilterInput<TOperand2>):
    | QueryFilterInput<TOperand2>
    | undefined;
}
