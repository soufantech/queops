import { ElementComparisonQueryFilter } from '../../query-filter';
import {
  ScalarParser,
  unescapedListParser,
  UnescapedListParserOptions,
  straightOperatorParser,
} from '../value-parser';
import { BaseUriParamHandler } from './base-uri-param-handler';
import { ElementComparisonOperator } from '../../query-builder-interface';
import {
  createOperatorAllowlistMiddleware,
  createOperatorDenylistMiddleware,
} from '../../query-filter';

export type ElementUriParamHandlerOptions = Pick<
  UnescapedListParserOptions,
  'separator' | 'maxElements'
>;

export class ElementUriParamHandler<
  TOperand = unknown
> extends BaseUriParamHandler<TOperand[]> {
  constructor(
    field: string,
    parser: ScalarParser<TOperand>,
    options?: ElementUriParamHandlerOptions,
  ) {
    super(
      field,
      straightOperatorParser(unescapedListParser(parser, options)),
      new ElementComparisonQueryFilter<TOperand>(),
    );
  }

  public defaultTo(
    operator: ElementComparisonOperator,
    operand: TOperand[],
  ): this {
    this.setDefaultValue({
      operand,
      operator,
    });

    return this;
  }

  public allowOperators(
    ...allowedOperators: ElementComparisonOperator[]
  ): this {
    this.filter.with(createOperatorAllowlistMiddleware(allowedOperators));

    return this;
  }

  public denyOperators(...deniedOperators: ElementComparisonOperator[]): this {
    this.filter.with(createOperatorDenylistMiddleware(deniedOperators));

    return this;
  }
}
