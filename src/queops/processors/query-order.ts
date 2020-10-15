import { integerParser, operatorParser } from './value-parsers';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createOrderAction } from './actions';
import {
  Filter,
  createOperandFilter,
  OperandFilterMapper,
  createPermittedOperatorsFilter,
  createForbiddenOperatorsFilter,
} from './filters';
import { OrderQueryValue, OrderOperator } from '../queries';

export type QueryOrderProcessorOptions = {
  filter?: OperandFilterMapper<number>;
  defaultValue?: OrderQueryValue;
  permittedOperators?: OrderOperator[];
  forbiddenOperators?: OrderOperator[];
};

export type QueryOrderFilter = Filter<number, OrderOperator>;

const ORDER_OPERATORS: OrderOperator[] = ['asc', 'desc'];

function buildFilters({
  filter,
  permittedOperators,
  forbiddenOperators,
}: QueryOrderProcessorOptions): QueryOrderFilter[] {
  const filters: QueryOrderFilter[] = [];

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

const NAME = 'QUERY_ORDER';

export class QueryOrderProcessor extends QueryProcessorImpl<
  number,
  OrderOperator
> {
  constructor(options: QueryOrderProcessorOptions = {}) {
    super({
      parser: operatorParser(ORDER_OPERATORS, integerParser()),
      name: NAME,
      filters: buildFilters(options),
      defaultValue: options.defaultValue,
      createAction: createOrderAction,
    });
  }
}
