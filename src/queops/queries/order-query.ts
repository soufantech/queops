import { QueryValue, QueryField } from './base-query';

export type OrderOperator = 'asc' | 'desc';

export type OrderQueryValue = QueryValue<number, OrderOperator>;

export type OrderQuery = OrderQueryValue & QueryField;
