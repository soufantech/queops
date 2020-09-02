import { UrlQueryFilterHandler } from '../url-query-filter-handler';
import {
  QueryBuilderDispatcher,
  MiddlewaredQueryFilter,
  Validator,
  createOperandValidationMiddleware,
} from '../../query-filter';
import { ValueParser } from '../value-parser';

export type BaseUrlQueryFilterHandlerParams<TOperand = unknown> = {
  filter: MiddlewaredQueryFilter<TOperand>;
  parser: ValueParser<TOperand>;
  field: string;
};

export class BaseUrlQueryFilterHandler<TOperand = unknown>
  implements UrlQueryFilterHandler {
  protected readonly filter: MiddlewaredQueryFilter<TOperand>;
  private readonly parser: ValueParser<TOperand>;
  public readonly field: string;

  constructor({
    parser,
    filter,
    field,
  }: BaseUrlQueryFilterHandlerParams<TOperand>) {
    this.filter = filter;
    this.parser = parser;
    this.field = field;
  }

  handle(conditions: string[]): QueryBuilderDispatcher | undefined {
    return conditions.reduce<QueryBuilderDispatcher | undefined>(
      (dispatcher, condition) => {
        if (dispatcher !== undefined) {
          return dispatcher;
        }

        const { value, opcode } = this.parser(condition);

        if (value === undefined) {
          return undefined;
        }

        console.log('opcode', opcode);

        return this.filter.filter({
          field: this.field,
          operand: value,
          operator: opcode ?? null,
        });
      },
      undefined,
    );
  }

  validateWith(validator: Validator): this {
    this.filter.with(createOperandValidationMiddleware(validator));

    return this;
  }
}
