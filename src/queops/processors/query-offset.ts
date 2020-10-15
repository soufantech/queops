import { integerParser } from './value-parsers';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createOffsetAction } from './actions';
import {
  Filter,
  createOperandFilter,
  OperandFilterMapper,
  createMinNumberFilter,
  createMaxNumberFilter,
} from './filters';

export type QueryOffsetProcessorOptions = {
  filter?: OperandFilterMapper<number>;
  defaultValue?: number;
  min?: number;
  max?: number;
};

export type QueryOffsetFilter = Filter<number, null>;

function buildFilters({
  filter,
  min,
  max,
}: QueryOffsetProcessorOptions): QueryOffsetFilter[] {
  const filters: QueryOffsetFilter[] = [];

  filters.push(createMinNumberFilter(0));

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

const NAME = 'QUERY_OFFSET';

export class QueryOffsetProcessor extends QueryProcessorImpl<number, null> {
  constructor(options: QueryOffsetProcessorOptions = {}) {
    super({
      parser: integerParser(),
      createAction: createOffsetAction,
      name: NAME,
      filters: buildFilters(options),
      defaultValue: options.defaultValue
        ? { operator: null, operand: options.defaultValue }
        : undefined,
    });
  }
}
