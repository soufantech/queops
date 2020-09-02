import { UrlQueryFilterHandler } from './url-query-filter-handler';

export type UrlQueryFiltersDescriptor = {
  [key: string]: UrlQueryFilterHandler | UrlQueryFilterHandler[];
};
