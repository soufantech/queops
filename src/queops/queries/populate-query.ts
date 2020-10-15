import { QueryValue, QueryField } from './base-query';

export type PopulateQueryValue = QueryValue<string[], null>;

export type PopulateQuery = PopulateQueryValue & QueryField;
