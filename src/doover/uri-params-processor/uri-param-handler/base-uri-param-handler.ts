import { UriParamHandler } from './uri-param-handler';
import {
  QueryBuilderDispatcher,
  MiddlewaredQueryFilter,
  Validator,
  createOperandValidationMiddleware,
  QueryFilterInput,
  QueryFilterMiddleware,
} from '../../query-filter';
import { ValueParser } from '../value-parser';

export type DefaultValue<TOperand = unknown> = Pick<
  QueryFilterInput<TOperand>,
  'operand' | 'operator'
>;

export class BaseUriParamHandler<TOperand = unknown>
  implements UriParamHandler {
  protected readonly filter: MiddlewaredQueryFilter<TOperand>;
  private readonly parser: ValueParser<TOperand>;
  private defaultValue?: DefaultValue<TOperand>;
  public readonly field: string;

  constructor(
    field: string,
    parser: ValueParser<TOperand>,
    filter: MiddlewaredQueryFilter<TOperand>,
  ) {
    this.filter = filter;
    this.parser = parser;
    this.field = field;
  }

  private _handle(conditions: string[]): QueryBuilderDispatcher | undefined {
    return conditions.reduce<QueryBuilderDispatcher | undefined>(
      (dispatcher, condition) => {
        if (dispatcher !== undefined) {
          return dispatcher;
        }

        const { value, opcode } = this.parser(condition);

        if (value === undefined) {
          return undefined;
        }

        return this.filter.filter({
          field: this.field,
          operand: value,
          operator: opcode ?? null,
        });
      },
      undefined,
    );
  }

  public handle(conditions: string[]): QueryBuilderDispatcher | undefined {
    const dispatcher = this._handle(conditions);

    if (dispatcher === undefined && this.defaultValue !== undefined) {
      return this.filter.filter({
        field: this.field,
        operand: this.defaultValue.operand,
        operator: this.defaultValue.operator,
      });
    }

    return dispatcher;
  }

  protected setDefaultValue(defaultValue: DefaultValue<TOperand>): void {
    this.defaultValue = defaultValue;
  }

  public validateWith(validator: Validator): this {
    this.filter.with(createOperandValidationMiddleware(validator));

    return this;
  }

  public withMiddleware(middleware: QueryFilterMiddleware<TOperand>): this {
    this.filter.with(middleware);

    return this;
  }
}
