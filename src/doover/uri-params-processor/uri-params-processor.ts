import { QueryBuilderInterface } from '../query-builder-interface';
import { ParsedUrlQuery, decode as decodeQuerystring } from 'querystring';
import { UriParamHandler } from './uri-param-handler';

type HandlerCollection = [string, UriParamHandler[]][];

export type UriParamsListing = {
  [key: string]: UriParamHandler | UriParamHandler[];
};

export class UriParamsProcessor {
  private readonly handlers: HandlerCollection;

  constructor(descriptor: UriParamsListing) {
    this.handlers = Object.entries(descriptor).map(([key, handlers]) => {
      return [key, ([] as UriParamHandler[]).concat(handlers)];
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

    this.handlers.forEach(([field, handlers]) => {
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
