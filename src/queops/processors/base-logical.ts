import { operatorParser, ScalarParser } from './value-parsers';
import {
  Filter,
  createPermittedOperatorsFilter,
  createForbiddenOperatorsFilter,
  createOperandFilter,
  OperandFilterMapper,
} from './filters';
import { LogicalOperator, LogicalQueryValue } from '../queries';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createLogicalAction } from './actions';

export type LogicalProcessorBaseOptions<TOperand> = {
  permittedOperators?: LogicalOperator[];
  forbiddenOperators?: LogicalOperator[];
  filter?: OperandFilterMapper<TOperand>;
  defaultValue?: LogicalQueryValue<TOperand>;
  bindingName?: string;
};

export type LogicalProcessorBaseParams<TOperand> = {
  parser: ScalarParser<TOperand>;
  name: string;
};

export type LogicalFilter<TOperand> = Filter<TOperand, LogicalOperator>;

const LOGICAL_OPERATORS: LogicalOperator[] = [
  'gt',
  'lt',
  'gte',
  'lte',
  'eq',
  'ne',
];

function buildFilters<TOperand>({
  permittedOperators,
  forbiddenOperators,
  filter,
}: LogicalProcessorBaseOptions<TOperand>): LogicalFilter<TOperand>[] {
  const filters: LogicalFilter<TOperand>[] = [];

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

export class LogicalProcessorBase<TOperand> extends QueryProcessorImpl<
  TOperand,
  LogicalOperator
> {
  constructor(
    params: LogicalProcessorBaseParams<TOperand>,
    options: LogicalProcessorBaseOptions<TOperand> = {},
  ) {
    super({
      parser: operatorParser(LOGICAL_OPERATORS, params.parser),
      filters: buildFilters(options),
      name: params.name,
      defaultValue: options.defaultValue,
      createAction: createLogicalAction,
      bindingName: options.bindingName,
    });
  }
}
