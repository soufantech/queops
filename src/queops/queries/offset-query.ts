import { QueryValue, QueryField } from './base-query';

export type OffsetQueryValue = QueryValue<number, null>;

export type OffsetQuery = OffsetQueryValue & QueryField;
