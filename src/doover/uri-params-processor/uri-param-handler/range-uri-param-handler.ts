import { RangeConditionQueryFilter } from '../../query-filter';
import {
  ScalarParser,
  unescapedRangeParser,
  UnescapedRangeParserOptions,
  straightOperatorParser,
} from '../value-parser';
import {
  BaseUriParamHandler,
  BaseUriParamHandlerParams,
} from './base-uri-param-handler';
import { RangeComparisonOperator } from '../../query-builder-interface';
import {
  createOperatorAllowlistMiddleware,
  createOperatorDenylistMiddleware,
} from '../../query-filter/query-filter-middlewares';

export type RangeUriParamHandlerParams<TOperand = unknown> = {
  operandParser: ScalarParser<TOperand>;
} & Pick<BaseUriParamHandlerParams<TOperand[]>, 'field'> &
  Pick<UnescapedRangeParserOptions, 'separator'>;

export class RangeUriParamHandler<
  TOperand = unknown
> extends BaseUriParamHandler<TOperand[]> {
  constructor({
    field,
    separator,
    operandParser,
  }: RangeUriParamHandlerParams<TOperand>) {
    super({
      field,
      parser: straightOperatorParser(
        unescapedRangeParser(operandParser, { separator }),
      ),
      filter: new RangeConditionQueryFilter<TOperand>(),
    });
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
