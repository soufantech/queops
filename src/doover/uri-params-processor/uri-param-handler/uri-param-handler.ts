import { QueryBuilderDispatcher } from '../../query-filter';

export interface UriParamHandler {
  handle(conditions: string[]): QueryBuilderDispatcher | undefined;
}
