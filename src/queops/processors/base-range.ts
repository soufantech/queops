import {
  unescapedRangeParser,
  operatorParser,
  ScalarParser,
  CompositeParser,
} from './value-parsers';
import {
  Filter,
  createPermittedOperatorsFilter,
  createForbiddenOperatorsFilter,
  createOperandFilter,
  OperandFilterMapper,
} from './filters';
import { RangeOperator, RangeQueryValue } from '../queries';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createRangeAction } from './actions';

export type RangeProcessorBaseOptions<TOperand> = {
  separator?: string;
  permittedOperators?: RangeOperator[];
  forbiddenOperators?: RangeOperator[];
  filter?: OperandFilterMapper<[TOperand, TOperand]>;
  defaultValue?: RangeQueryValue<TOperand>;
};

export type RangeProcessorBaseParams<TOperand> = {
  parser: ScalarParser<TOperand>;
  name: string;
};

export type RangeFilter<TOperand> = Filter<[TOperand, TOperand], RangeOperator>;

const RANGE_OPERATORS: RangeOperator[] = ['bet', 'nbet'];

function buildFilters<TOperand>({
  permittedOperators,
  forbiddenOperators,
  filter,
}: RangeProcessorBaseOptions<TOperand>): RangeFilter<TOperand>[] {
  const filters: RangeFilter<TOperand>[] = [];

  if (Array.isArray(permittedOperators)) {
    filters.push(createPermittedOperatorsFilter(permittedOperators));
  }

  if (Array.isArray(forbiddenOperators)) {
    filters.push(createForbiddenOperatorsFilter(forbiddenOperators));
  }

  if (typeof filter === 'function') {
    filters.push(createOperandFilter(filter));
  }

  return filters;
}

export class RangeProcessorBase<TOperand> extends QueryProcessorImpl<
  [TOperand, TOperand],
  RangeOperator
> {
  constructor(
    params: RangeProcessorBaseParams<TOperand>,
    options: RangeProcessorBaseOptions<TOperand> = {},
  ) {
    super({
      parser: operatorParser(
        RANGE_OPERATORS,
        unescapedRangeParser(params.parser, {
          separator: options.separator,
        }) as CompositeParser<[TOperand, TOperand]>,
      ),
      filters: buildFilters(options),
      name: params.name,
      defaultValue: options.defaultValue,
      createAction: createRangeAction,
    });
  }
}
