import { unescapedListParser, stringParser } from './value-parsers';
import {
  Filter,
  createAcceptedElementsFilter,
  createIgnoredElementsFilter,
  createOperandFilter,
  OperandFilterMapper,
  createMaxElementsFilter,
  createMinElementsFilter,
} from './filters';
import { IncludeQueryValue } from '../queries';
import {
  QueryActionFactory,
  QueryProcessorImpl,
} from '../query-processor-impl';

export type QueryProjectionProcessorBaseOptions = {
  separator?: string;
  acceptedElements?: string[];
  ignoredElements?: string[];
  maxElements?: number;
  minElements?: number;
  filter?: OperandFilterMapper<string[]>;
  defaultValue?: IncludeQueryValue;
};

export type QueryProjectionProcessorBaseParams = {
  name: string;
  createAction: QueryActionFactory<string[], null>;
};

export type ProjectionFilter = Filter<string[], null>;

function buildFilters({
  acceptedElements,
  ignoredElements,
  maxElements,
  minElements,
  filter,
}: QueryProjectionProcessorBaseOptions): ProjectionFilter[] {
  const filters: ProjectionFilter[] = [];

  if (Array.isArray(acceptedElements)) {
    filters.push(createAcceptedElementsFilter(acceptedElements));
  }

  if (Array.isArray(ignoredElements)) {
    filters.push(createIgnoredElementsFilter(ignoredElements));
  }

  if (Number.isInteger(maxElements)) {
    filters.push(createMaxElementsFilter(maxElements as number));
  }

  if (Number.isInteger(minElements)) {
    filters.push(createMinElementsFilter(minElements as number));
  }

  if (typeof filter === 'function') {
    filters.push(createOperandFilter(filter));
  }

  return filters;
}

export class QueryProjectionProcessorBase extends QueryProcessorImpl<
  string[],
  null
> {
  constructor(
    params: QueryProjectionProcessorBaseParams,
    options: QueryProjectionProcessorBaseOptions = {},
  ) {
    super({
      parser: unescapedListParser(stringParser(), {
        // truncate elements at max + 1 on parser level if maxElements is defined
        maxElements:
          options.maxElements !== undefined
            ? options.maxElements + 1
            : undefined,
        separator: options.separator,
      }),
      filters: buildFilters(options),
      name: params.name,
      createAction: params.createAction,
    });
  }
}
