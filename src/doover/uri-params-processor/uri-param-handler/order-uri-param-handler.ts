import { OrderQueryFilter } from '../../query-filter';
import { straightOperatorParser, integerParser } from '../value-parser';
import { BaseUriParamHandler } from './base-uri-param-handler';
import {
  createOperatorDenylistMiddleware,
  createOperatorAllowlistMiddleware,
} from '../../query-filter';
import { OrderingOperator } from '../../query-builder-interface';

export class OrderUriParamHandler extends BaseUriParamHandler<number> {
  constructor(field: string) {
    super(
      field,
      straightOperatorParser(integerParser({ min: 1 })),
      new OrderQueryFilter(),
    );
  }

  public defaultTo(operator: OrderingOperator, priority: number): this {
    this.setDefaultValue({
      operand: priority,
      operator: operator,
    });

    return this;
  }

  public allowOperator(allowedOperator: OrderingOperator): this {
    this.filter.with(createOperatorAllowlistMiddleware([allowedOperator]));

    return this;
  }

  public denyOperator(deniedOperator: OrderingOperator): this {
    this.filter.with(createOperatorDenylistMiddleware([deniedOperator]));

    return this;
  }
}
