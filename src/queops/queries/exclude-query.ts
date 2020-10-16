import { QueryValue, QueryField } from './base-query';

export type ExcludeQueryValue = QueryValue<string[], null>;

export type ExcludeQuery = ExcludeQueryValue & QueryField;
