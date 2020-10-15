import { QueryValue, QueryField } from './base-query';

export type EqualQueryValue<TOperand> = QueryValue<TOperand, null>;

export type EqualQuery<TOperand> = EqualQueryValue<TOperand> & QueryField;
