import { QueryValue, QueryField } from './base-query';

export type ElementOperator = 'in' | 'nin';

export type ElementQueryValue<TOperand> = QueryValue<
  TOperand[],
  ElementOperator
>;

export type ElementQuery<TOperand> = ElementQueryValue<TOperand> & QueryField;
