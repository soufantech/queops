import { ScalarParser } from './value-parsers';
import { Filter, createOperandFilter, OperandFilterMapper } from './filters';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createEqualAction } from './actions';

export type EqualProcessorBaseOptions<TOperand> = {
  filter?: OperandFilterMapper<TOperand>;
  defaultValue?: TOperand;
};

export type EqualProcessorBaseParams<TOperand> = {
  parser: ScalarParser<TOperand>;
  name: string;
};

export type EqualFilter<TOperand> = Filter<TOperand, null>;

function buildFilters<TOperand>({
  filter,
}: EqualProcessorBaseOptions<TOperand>): EqualFilter<TOperand>[] {
  const filters: EqualFilter<TOperand>[] = [];

  if (typeof filter === 'function') {
    filters.push(createOperandFilter(filter));
  }

  return filters;
}

export class EqualProcessorBase<TOperand> extends QueryProcessorImpl<
  TOperand,
  null
> {
  constructor(
    params: EqualProcessorBaseParams<TOperand>,
    options: EqualProcessorBaseOptions<TOperand> = {},
  ) {
    super({
      parser: params.parser,
      createAction: createEqualAction,
      name: params.name,
      filters: buildFilters(options),
      defaultValue: options.defaultValue
        ? { operator: null, operand: options.defaultValue }
        : undefined,
    });
  }
}
