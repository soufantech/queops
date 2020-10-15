import { QueryValue, QueryField } from './base-query';

export type ProjectOperator = 'inc' | 'exc';

export type ProjectQueryValue = QueryValue<string[], ProjectOperator>;

export type ProjectQuery = ProjectQueryValue & QueryField;
