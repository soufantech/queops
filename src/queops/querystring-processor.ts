import { QueryBuilder } from './query-builder';
import { ParsedUrlQuery, decode } from 'querystring';
import {
  QueryProcessor,
  QueryProcessingResult,
  Notice,
  QueryAction,
} from './query-processor';

export type QueryMapping = {
  [key: string]: QueryProcessor | QueryProcessor[];
};

export class QuerystringProcessor {
  private readonly processors: [string, QueryProcessor[]][];

  constructor(mapping: QueryMapping) {
    this.processors = Object.entries(mapping).map(([key, processors]) => {
      return [key, ([] as QueryProcessor[]).concat(processors)];
    });
  }

  process(querystring: string | ParsedUrlQuery): QueryProcessingResult {
    const queryDict =
      typeof querystring === 'string' ? decode(querystring) : querystring;

    const actionAggregator: QueryAction[] = [];
    const noticesAggregator: Notice[][] = [];

    this.processors.forEach(([field, processors]) => {
      const values = ([] as string[]).concat(queryDict[field] ?? []);

      processors.forEach((processor) => {
        const { action, notices } = processor.process(field, values);

        actionAggregator.push(action);
        noticesAggregator.push(notices);
      });
    });

    return {
      action: (queryBuilder: QueryBuilder) =>
        actionAggregator.forEach((a) => a(queryBuilder)),
      notices: noticesAggregator.flat(),
    };
  }
}
