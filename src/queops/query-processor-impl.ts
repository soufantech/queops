import { QueryValue, OperatorSuperType, Query } from './queries';
import { QueryAction, Notice } from './query-processor';
import { Filter, ValueParser, noopAction } from './processors';
import { Result, failure, success } from './result';

class ResultBuilder {
  private readonly notices: Notice[] = [];
  private action: QueryAction = noopAction;

  constructor(
    private readonly queryType: string,
    private readonly queryKey: string,
    private readonly queryValues: string[],
  ) {}

  addNotice(notice: SubNotice | Notice): this {
    this.notices.push({
      queryType: this.queryType,
      queryKey: this.queryKey,
      queryValues: this.queryValues,
      ...notice,
    });

    return this;
  }

  setAction(action: QueryAction): this {
    this.action = action;

    return this;
  }

  getResult() {
    return {
      notices: this.notices,
      action: this.action,
    };
  }
}

export type QueryProcessingResult = {
  action: QueryAction;
  notices: Notice[];
};

export interface QueryActionFactory<
  TOperand,
  TOperator extends OperatorSuperType
> {
  (query: Query<TOperand, TOperator>): QueryAction;
}

export type QueryProcessorParams<
  TOperand,
  TOperator extends OperatorSuperType
> = {
  parser: ValueParser<TOperand>;
  filters: Filter<TOperand, TOperator>[];
  createAction: QueryActionFactory<TOperand, TOperator>;
  name: string;
  defaultValue?: QueryValue<TOperand, TOperator>;
  // bindingName?: string;
};

type SubNotice = Pick<Notice, 'message' | 'code'>;

export class QueryProcessorImpl<TOperand, TOperator extends OperatorSuperType> {
  private readonly parser: ValueParser<TOperand>;
  private readonly filters: Filter<TOperand, TOperator>[];
  private readonly createAction: QueryActionFactory<TOperand, TOperator>;
  private readonly name: string;
  private readonly defaultValue?: QueryValue<TOperand, TOperator>;
  // private readonly bindingName?: string;

  constructor(params: QueryProcessorParams<TOperand, TOperator>) {
    this.createAction = params.createAction;
    this.filters = params.filters ?? [];
    this.parser = params.parser;
    this.name = params.name;
    this.defaultValue = params.defaultValue;
    // this.bindingName = params.bindingName;
  }

  public process(field: string, rawValues: string[]): QueryProcessingResult {
    const resultBuilder = new ResultBuilder(this.name, field, rawValues);
    // const bindingName = this.bindingName ?? field;

    const queryResult = this.parse(rawValues).map((query) => {
      return this.runFilters(query);
    });

    if (queryResult.isFailure()) {
      resultBuilder.addNotice(queryResult.unwrap());

      if (this.defaultValue) {
        resultBuilder
          .setAction(this.createAction({ field, ...this.defaultValue }))
          .addNotice({
            code: 'USING_DEFAULT',
            message: 'Using default value for this query',
          });
      }
    } else {
      resultBuilder.setAction(
        this.createAction({ field, ...queryResult.unwrap() }),
      );
    }

    return resultBuilder.getResult();
  }

  private parseValue(
    rawValue: string,
  ): Result<string, QueryValue<TOperand, TOperator>> {
    const { opcode, value } = this.parser(rawValue);

    if (value === undefined) {
      return failure('Parsing failed');
    }

    return success({
      operand: value,
      operator: (opcode ?? null) as TOperator,
    });
  }

  private parse(
    rawValues: string[],
  ): Result<SubNotice, QueryValue<TOperand, TOperator>> {
    return rawValues.reduce<Result<SubNotice, QueryValue<TOperand, TOperator>>>(
      (result, rawValue) => {
        if (result.isSuccess()) {
          return result;
        }

        const parsingResult = this.parseValue(rawValue);

        if (parsingResult.isSuccess()) {
          return parsingResult;
        }

        return result;
      },
      failure({
        code: 'QUERY_UNDETECTED',
        message:
          'Could not detect a compatible well-formed query amongst the given values',
      }),
    );
  }

  private runFilters(
    structuredQuery: QueryValue<TOperand, TOperator>,
  ): Result<SubNotice, QueryValue<TOperand, TOperator>> {
    return this.filters.reduce<
      Result<SubNotice, QueryValue<TOperand, TOperator>>
    >((result, filter) => {
      if (result.isFailure()) {
        return result;
      }

      const filterResult = filter(structuredQuery);

      if (filterResult.isFailure()) {
        return failure<SubNotice, QueryValue<TOperand, TOperator>>({
          code: 'INVALID_VALUE',
          message: filterResult.unwrap(),
        });
      }

      return filterResult;
    }, success(structuredQuery));
  }
}
