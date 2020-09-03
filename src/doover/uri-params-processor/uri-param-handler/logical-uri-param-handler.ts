import { LogicalComparisonQueryFilter } from '../../query-filter';
import { ScalarParser, straightOperatorParser } from '../value-parser';
import { BaseUriParamHandler } from './base-uri-param-handler';
import { LogicalComparisonOperator } from '../../query-builder-interface';
import {
  createOperatorAllowlistMiddleware,
  createOperatorDenylistMiddleware,
} from '../../query-filter';

export class LogicalUriParamHandler<
  TOperand = unknown
> extends BaseUriParamHandler<TOperand> {
  constructor(field: string, parser: ScalarParser<TOperand>) {
    super(
      field,
      straightOperatorParser(parser),
      new LogicalComparisonQueryFilter<TOperand>(),
    );
  }

  public defaultTo(
    operator: LogicalComparisonOperator,
    operand: TOperand,
  ): this {
    this.setDefaultValue({
      operand,
      operator,
    });

    return this;
  }

  public allowOperators(
    ...allowedOperators: LogicalComparisonOperator[]
  ): this {
    this.filter.with(createOperatorAllowlistMiddleware(allowedOperators));

    return this;
  }

  public denyOperators(...deniedOperators: LogicalComparisonOperator[]): this {
    this.filter.with(createOperatorDenylistMiddleware(deniedOperators));

    return this;
  }
}
