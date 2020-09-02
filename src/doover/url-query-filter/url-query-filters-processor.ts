import { QueryBuilderInterface } from '../query-builder-interface';
import { UrlQueryFiltersDescriptor } from './url-query-filters-descriptor';
import { ParsedUrlQuery, decode as decodeQuerystring } from 'querystring';
import { UrlQueryFilterHandler } from './url-query-filter-handler';

type FilterCollection = [string, UrlQueryFilterHandler[]][];

export class UrlQueryFiltersProcessor {
  private readonly filters: FilterCollection;

  constructor(descriptor: UrlQueryFiltersDescriptor) {
    this.filters = Object.entries(descriptor).map(([key, handlers]) => {
      return [key, ([] as UrlQueryFilterHandler[]).concat(handlers)];
    });
  }

  process(
    querystring: string | ParsedUrlQuery,
    queryBuilder: QueryBuilderInterface,
  ): boolean {
    const queryStr =
      typeof querystring === 'string'
        ? decodeQuerystring(querystring)
        : querystring;

    let completedFlawlessly = true;

    this.filters.forEach(([field, handlers]) => {
      const values = ([] as string[]).concat(queryStr[field] ?? []);

      handlers.forEach((handler) => {
        const dispatcher = handler.handle(values);

        if (dispatcher === undefined) {
          completedFlawlessly = false;
        } else {
          dispatcher(queryBuilder);
        }
      });
    });

    return completedFlawlessly;
  }
}
