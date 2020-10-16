import { QueryValue, QueryField } from './base-query';

export type IncludeQueryValue = QueryValue<string[], null>;

export type IncludeQuery = IncludeQueryValue & QueryField;
