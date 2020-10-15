import { QueryValue, QueryField } from './base-query';

export type LogicalOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';

export type LogicalQueryValue<TOperand> = QueryValue<TOperand, LogicalOperator>;

export type LogicalQuery<TOperand> = LogicalQueryValue<TOperand> & QueryField;
