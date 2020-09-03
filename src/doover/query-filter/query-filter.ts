import { QueryBuilderInterface } from '../query-builder-interface';

export type QueryFilterInput<TOperand = unknown> = {
  field: string;
  operand: TOperand;
  operator: string | null;
};

export interface QueryBuilderDispatcher {
  (queryBuilder: QueryBuilderInterface): void;
}

export interface QueryFilter<TOperand = unknown> {
  filter(
    filterInput: QueryFilterInput<TOperand>,
  ): QueryBuilderDispatcher | undefined;
}
