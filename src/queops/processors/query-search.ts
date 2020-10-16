import { stringParser } from './value-parsers';
import { Filter, createOperandFilter, OperandFilterMapper } from './filters';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createSearchAction } from './actions';

export type QuerySearchProcessorOptions = {
  filter?: OperandFilterMapper<string>;
  defaultValue?: string;
  bindingName?: string;
};

const NAME = 'QUERY_SEARCH';

export type QuerySearchFilter = Filter<string, null>;

function buildFilters({ filter }: QuerySearchProcessorOptions) {
  const filters: QuerySearchFilter[] = [];

  if (typeof filter === 'function') {
    filters.push(createOperandFilter(filter));
  }

  return filters;
}

export class QuerySearchProcessor extends QueryProcessorImpl<string, null> {
  constructor(options: QuerySearchProcessorOptions = {}) {
    super({
      parser: stringParser(),
      createAction: createSearchAction,
      name: NAME,
      filters: buildFilters(options),
      defaultValue: options.defaultValue
        ? { operator: null, operand: options.defaultValue }
        : undefined,
      bindingName: options.bindingName,
    });
  }
}
