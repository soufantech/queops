import { QueryValue, QueryField } from './base-query';

export type RangeOperator = 'bet' | 'nbet';

export type RangeQueryValue<TOperand> = QueryValue<
  [TOperand, TOperand],
  RangeOperator
>;

export type RangeQuery<TOperand> = RangeQueryValue<TOperand> & QueryField;
