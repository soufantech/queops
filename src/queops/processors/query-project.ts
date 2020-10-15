import {
  unescapedListParser,
  operatorParser,
  stringParser,
} from './value-parsers';
import {
  Filter,
  createPermittedOperatorsFilter,
  createForbiddenOperatorsFilter,
  createAcceptedElementsFilter,
  createIgnoredElementsFilter,
  createOperandFilter,
  OperandFilterMapper,
  createMaxElementsFilter,
  createMinElementsFilter,
} from './filters';
import { ProjectOperator, ProjectQueryValue } from '../queries';
import { QueryProcessorImpl } from '../query-processor-impl';
import { createProjectAction } from './actions';

export type QueryProjectProcessorOptions = {
  separator?: string;
  permittedOperators?: ProjectOperator[];
  forbiddenOperators?: ProjectOperator[];
  acceptedElements?: string[];
  ignoredElements?: string[];
  maxElements?: number;
  minElements?: number;
  filter?: OperandFilterMapper<string[]>;
  defaultValue?: ProjectQueryValue;
};

export type ProjectFilter = Filter<string[], ProjectOperator>;

const NAME = 'QUERY_PROJECT';

const PROJECT_OPERATORS: ProjectOperator[] = ['inc', 'exc'];

function buildFilters({
  permittedOperators,
  forbiddenOperators,
  acceptedElements,
  ignoredElements,
  maxElements,
  minElements,
  filter,
}: QueryProjectProcessorOptions): ProjectFilter[] {
  const filters: ProjectFilter[] = [];

  if (Array.isArray(permittedOperators)) {
    filters.push(createPermittedOperatorsFilter(permittedOperators));
  }

  if (Array.isArray(forbiddenOperators)) {
    filters.push(createForbiddenOperatorsFilter(forbiddenOperators));
  }

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

export class QueryProjectProcessor extends QueryProcessorImpl<
  string[],
  ProjectOperator
> {
  constructor(options: QueryProjectProcessorOptions = {}) {
    super({
      parser: operatorParser(
        PROJECT_OPERATORS,
        unescapedListParser(stringParser(), {
          // truncate elements at max + 1 on parser level if maxElements is defined
          maxElements:
            options.maxElements !== undefined
              ? options.maxElements + 1
              : undefined,
          separator: options.separator,
        }),
      ),
      filters: buildFilters(options),
      name: NAME,
      createAction: createProjectAction,
      defaultValue: options.defaultValue,
    });
  }
}
