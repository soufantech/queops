import { MiddlewaredQueryFilter } from '../../query-filter';
import { integerParser, IntegerParserOptions } from '../value-parser';
import { BaseUriParamHandler } from './base-uri-param-handler';
import {
  createMinNumberValidationMiddleware,
  createMaxNumberValidationMiddleware,
} from '../../query-filter';

export type BasePagingUriParamHandlerOptions = IntegerParserOptions;

export class BasePagingUriParamHandler extends BaseUriParamHandler<number> {
  constructor(
    field: string,
    filter: MiddlewaredQueryFilter<number>,
    options?: BasePagingUriParamHandlerOptions,
  ) {
    super(field, integerParser(options), filter);
  }

  public defaultTo(num: number): this {
    this.setDefaultValue({
      operand: num,
      operator: null,
    });

    return this;
  }

  public max(maxNumber: number): this {
    this.filter.with(createMaxNumberValidationMiddleware(maxNumber));

    return this;
  }

  public min(minNumber: number): this {
    this.filter.with(createMinNumberValidationMiddleware(minNumber));

    return this;
  }
}
