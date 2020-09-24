import { RangeComparisonQueryFilter } from '../../query-filter';
import {
  ScalarParser,
  unescapedRangeParser,
  UnescapedRangeParserOptions,
  straightOperatorParser,
} from '../value-parser';
import { BaseUriParamHandler } from './base-uri-param-handler';
import { RangeComparisonOperator } from '../../query-builder-interface';
import {
  createOperatorAllowlistMiddleware,
  createOperatorDenylistMiddleware,
} from '../../query-filter';

export type RangeUriParamHandlerOptions = UnescapedRangeParserOptions;

export class RangeUriParamHandler<
  TOperand = unknown
> extends BaseUriParamHandler<TOperand[]> {
  constructor(
    field: string,
    parser: ScalarParser<TOperand>,
    options?: RangeUriParamHandlerOptions,
  ) {
    super(
      field,
      straightOperatorParser(unescapedRangeParser(parser, options)),
      new RangeComparisonQueryFilter<TOperand>(),
    );
  }

  public defaultTo(
    operator: RangeComparisonOperator,
    operand: TOperand[],
  ): this {
    this.setDefaultValue({
      operand,
      operator,
    });

    return this;
  }

  public allowOperators(...allowedOperators: RangeComparisonOperator[]): this {
    this.filter.with(createOperatorAllowlistMiddleware(allowedOperators));

    return this;
  }

  public denyOperators(...deniedOperators: RangeComparisonOperator[]): this {
    this.filter.with(createOperatorDenylistMiddleware(deniedOperators));

    return this;
  }
}
