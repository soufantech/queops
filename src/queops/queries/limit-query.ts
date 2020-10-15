import { QueryValue, QueryField } from './base-query';

export type LimitQueryValue = QueryValue<number, null>;

export type LimitQuery = LimitQueryValue & QueryField;
