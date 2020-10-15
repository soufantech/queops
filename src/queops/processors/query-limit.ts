import { integerParser } from './value-parsers';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createLimitAction } from './actions';
import {
  Filter,
  createOperandFilter,
  OperandFilterMapper,
  createMinNumberFilter,
  createMaxNumberFilter,
} from './filters';

export type QueryLimitProcessorOptions = {
  filter?: OperandFilterMapper<number>;
  defaultValue?: number;
  min?: number;
  max?: number;
};

export type QueryLimitFilter = Filter<number, null>;

function buildFilters({
  filter,
  min,
  max,
}: QueryLimitProcessorOptions): QueryLimitFilter[] {
  const filters: QueryLimitFilter[] = [];

  filters.push(createMinNumberFilter(1));

  if (Number.isInteger(min)) {
    filters.push(createMinNumberFilter(min as number));
  }

  if (Number.isInteger(max)) {
    filters.push(createMaxNumberFilter(max as number));
  }

  if (typeof filter === 'function') {
    filters.push(createOperandFilter(filter));
  }

  return filters;
}

const NAME = 'QUERY_LIMIT';

export class QueryLimitProcessor extends QueryProcessorImpl<number, null> {
  constructor(options: QueryLimitProcessorOptions = {}) {
    super({
      parser: integerParser(),
      name: NAME,
      filters: buildFilters(options),
      defaultValue: options.defaultValue
        ? { operator: null, operand: options.defaultValue }
        : undefined,
      createAction: createLimitAction,
    });
  }
}
