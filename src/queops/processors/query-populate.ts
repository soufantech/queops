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
import { QueryProcessorImpl } from '../query-processor-impl';
import { createPopulateAction } from './actions';

export type QueryPopulateProcessorOptions = {
  separator?: string;
  acceptedElements?: string[];
  ignoredElements?: string[];
  maxElements?: number;
  minElements?: number;
  filter?: OperandFilterMapper<string[]>;
  defaultValue?: string[];
  bindingName?: string;
};

export type PopulateFilter = Filter<string[], null>;

const NAME = 'QUERY_POPULATE';

function buildFilters({
  acceptedElements,
  ignoredElements,
  maxElements,
  minElements,
  filter,
}: QueryPopulateProcessorOptions): PopulateFilter[] {
  const filters: PopulateFilter[] = [];

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

export class QueryPopulateProcessor extends QueryProcessorImpl<string[], null> {
  constructor(options: QueryPopulateProcessorOptions = {}) {
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
      name: NAME,
      createAction: createPopulateAction,
      bindingName: options.bindingName,
      defaultValue: options.defaultValue
        ? { operand: options.defaultValue, operator: null }
        : undefined,
    });
  }
}
