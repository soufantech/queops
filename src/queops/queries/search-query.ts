import { QueryValue, QueryField } from './base-query';

export type SearchQueryValue = QueryValue<string, null>;

export type SearchQuery = SearchQueryValue & QueryField;
