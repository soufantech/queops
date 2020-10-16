import {
  unescapedListParser,
  operatorParser,
  ScalarParser,
} from './value-parsers';
import {
  Filter,
  createPermittedOperatorsFilter,
  createForbiddenOperatorsFilter,
  createOperandFilter,
  OperandFilterMapper,
  createMaxElementsFilter,
  createMinElementsFilter,
} from './filters';
import { ElementOperator, ElementQueryValue } from '../queries';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createElementAction } from './actions';

export type ElementProcessorBaseOptions<TOperand> = {
  separator?: string;
  permittedOperators?: ElementOperator[];
  forbiddenOperators?: ElementOperator[];
  maxElements?: number;
  minElements?: number;
  filter?: OperandFilterMapper<TOperand[]>;
  defaultValue?: ElementQueryValue<TOperand>;
  bindingName?: string;
};

export type ElementProcessorBaseParams<TOperand> = {
  parser: ScalarParser<TOperand>;
  name: string;
};

export type ElementFilter<TOperand> = Filter<TOperand[], ElementOperator>;

const ELEMENT_OPERATORS: ElementOperator[] = ['in', 'nin'];

function buildFilters<TOperand>({
  permittedOperators,
  forbiddenOperators,
  maxElements,
  minElements,
  filter,
}: ElementProcessorBaseOptions<TOperand>): ElementFilter<TOperand>[] {
  const filters: ElementFilter<TOperand>[] = [];

  if (Array.isArray(permittedOperators)) {
    filters.push(createPermittedOperatorsFilter(permittedOperators));
  }

  if (Array.isArray(forbiddenOperators)) {
    filters.push(createForbiddenOperatorsFilter(forbiddenOperators));
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

export class ElementProcessorBase<TOperand> extends QueryProcessorImpl<
  TOperand[],
  ElementOperator
> {
  constructor(
    params: ElementProcessorBaseParams<TOperand>,
    options: ElementProcessorBaseOptions<TOperand> = {},
  ) {
    super({
      parser: operatorParser(
        ELEMENT_OPERATORS,
        unescapedListParser(params.parser, {
          // truncate elements at max + 1 on parser level if maxElements is defined
          maxElements:
            options.maxElements !== undefined
              ? options.maxElements + 1
              : undefined,
          separator: options.separator,
        }),
      ),
      filters: buildFilters(options),
      name: params.name,
      createAction: createElementAction,
      defaultValue: options.defaultValue,
      bindingName: options.bindingName,
    });
  }
}
