import { QueryValue, OperatorSuperType, Query } from './queries';
import { QueryAction, Notice, QueryProcessingResult } from './query-processor';
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
  bindingName?: string;
};

type SubNotice = Pick<Notice, 'message' | 'code'>;

const IGNORED_ERROR_CODES = ['QUERY_UNDETECTED', 'PARSING_FAILED'];

export class QueryProcessorImpl<TOperand, TOperator extends OperatorSuperType> {
  private readonly parser: ValueParser<TOperand>;
  private readonly filters: Filter<TOperand, TOperator>[];
  private readonly createAction: QueryActionFactory<TOperand, TOperator>;
  private readonly name: string;
  private readonly defaultValue?: QueryValue<TOperand, TOperator>;
  private readonly bindingName?: string;

  constructor(params: QueryProcessorParams<TOperand, TOperator>) {
    this.createAction = params.createAction;
    this.filters = params.filters ?? [];
    this.parser = params.parser;
    this.name = params.name;
    this.defaultValue = params.defaultValue;
    this.bindingName = params.bindingName;
  }

  public process(field: string, rawValues: string[]): QueryProcessingResult {
    const resultBuilder = new ResultBuilder(this.name, field, rawValues);
    const bindingName = this.bindingName ?? field;

    return this.parse(rawValues)
      .map((query) => this.runFilters(query))
      .flatMap<ResultBuilder>((q) =>
        resultBuilder.setAction(
          this.createAction({ field: bindingName, ...q }),
        ),
      )
      .onFailure((f) => {
        if (!IGNORED_ERROR_CODES.includes(f.code)) {
          resultBuilder.addNotice(f);
        }
      })
      .recover(() =>
        this.defaultValue === undefined
          ? resultBuilder
          : resultBuilder
              .setAction(
                this.createAction({ field: bindingName, ...this.defaultValue }),
              )
              .addNotice({
                code: 'USING_DEFAULT',
                message: 'Using default value for this query',
              }),
      )
      .getOrThrow()
      .getResult();
  }

  private parseValue(
    rawValue: string,
  ): Result<SubNotice, QueryValue<TOperand, TOperator>> {
    const { opcode, value } = this.parser(rawValue);

    if (value === undefined) {
      return failure({
        code: 'PARSING_FAILED',
        message: 'Parsing failed',
      });
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
        return result.mapFailure(() => this.parseValue(rawValue));
      },
      failure<SubNotice, QueryValue<TOperand, TOperator>>({
        code: 'QUERY_UNDETECTED',
        message:
          'Could not detect a well-formed query amongst the given values',
      }),
    );
  }

  private runFilters(
    structuredQuery: QueryValue<TOperand, TOperator>,
  ): Result<SubNotice, QueryValue<TOperand, TOperator>> {
    return this.filters.reduce<
      Result<SubNotice, QueryValue<TOperand, TOperator>>
    >((result, filter) => {
      return result.map((s) =>
        filter(s).flatMapFailure((errorMessage) => {
          return {
            code: 'INVALID_VALUE',
            message: errorMessage,
          };
        }),
      );
    }, success(structuredQuery));
  }
}
