import { RangeConditionQueryFilter } from '../../query-filter';
import {
  ScalarParser,
  unescapedRangeParser,
  UnescapedRangeParserOptions,
  straightOperatorParser,
} from '../value-parsers';
import {
  BaseUrlQueryFilterHandler,
  BaseUrlQueryFilterHandlerParams,
} from './base-url-query-filter-handler';
import { RangeComparisonOperator } from '../../query-builder-interface';
import {
  createOperatorAllowlistMiddleware,
  createOperatorDenylistMiddleware,
} from '../../query-filter/query-filter-middlewares';

export type RangeUrlQueryFilterHandlerParams<TOperand = unknown> = {
  operandParser: ScalarParser<TOperand>;
} & Pick<BaseUrlQueryFilterHandlerParams<TOperand[]>, 'field'> &
  Pick<UnescapedRangeParserOptions, 'separator'>;

export class RangeUrlQueryFilterHandler<
  TOperand = unknown
> extends BaseUrlQueryFilterHandler<TOperand[]> {
  constructor({
    field,
    separator,
    operandParser,
  }: RangeUrlQueryFilterHandlerParams<TOperand>) {
    super({
      field,
      parser: straightOperatorParser(
        unescapedRangeParser(operandParser, { separator }),
      ),
      filter: new RangeConditionQueryFilter<TOperand>(),
    });
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
