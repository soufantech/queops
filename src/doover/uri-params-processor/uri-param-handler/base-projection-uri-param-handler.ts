import { MiddlewaredQueryFilter } from '../../query-filter';
import {
  unescapedListParser,
  stringParser,
  UnescapedListParserOptions,
} from '../value-parser';
import { BaseUriParamHandler } from './base-uri-param-handler';
import {
  createOperandsAllowlistFilterMiddleware,
  createOperandsDenylistFilterMiddleware,
} from '../../query-filter';

export type BaseProjectionUriParamHandlerOptions = UnescapedListParserOptions;

export class BaseProjectionUriParamHandler extends BaseUriParamHandler<
  string[]
> {
  constructor(
    field: string,
    filter: MiddlewaredQueryFilter<string[]>,
    options?: BaseProjectionUriParamHandlerOptions,
  ) {
    super(field, unescapedListParser(stringParser(), options), filter);
  }

  public defaultTo(fields: string[]): this;
  public defaultTo(...fields: string[]): this;
  public defaultTo(fields: string | string[]): this {
    const fieldsArray =
      // eslint-disable-next-line prefer-rest-params
      Array.isArray(fields) ? fields : Array.from(arguments);

    this.setDefaultValue({
      operand: fieldsArray,
      operator: null,
    });

    return this;
  }

  public accept(fields: string[]): this;
  public accept(...fields: string[]): this;
  public accept(fields: string | string[]): this {
    const fieldsArray =
      // eslint-disable-next-line prefer-rest-params
      Array.isArray(fields) ? fields : Array.from(arguments);

    this.filter.with(createOperandsAllowlistFilterMiddleware(fieldsArray));

    return this;
  }

  public ignore(fields: string[]): this;
  public ignore(...fields: string[]): this;
  public ignore(fields: string | string[]): this {
    const fieldsArray =
      // eslint-disable-next-line prefer-rest-params
      Array.isArray(fields) ? fields : Array.from(arguments);

    this.filter.with(createOperandsDenylistFilterMiddleware(fieldsArray));

    return this;
  }
}
