import { QueryBuilderDispatcher } from '../query-filter';

export interface UrlQueryFilterHandler {
  handle(conditions: string[]): QueryBuilderDispatcher | undefined;
}
