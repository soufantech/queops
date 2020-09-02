import { QueryBuilderInterface } from '../query-builder-interface';

export interface QueryBuilderDispatcher {
  (queryBuilder: QueryBuilderInterface): void;
}
