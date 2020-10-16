import {
  ElementOperator,
  LogicalOperator,
  OrderOperator,
  RangeOperator,
} from './queries';

export interface QueryBuilder {
  whereElement<TOperand>(
    field: string,
    operator: ElementOperator,
    elements: TOperand[],
  ): void;
  whereLogical<TOperand>(
    field: string,
    operator: LogicalOperator,
    operand: TOperand,
  ): void;
  whereRange<TOperand>(
    field: string,
    operator: RangeOperator,
    rangeTuple: [TOperand, TOperand],
  ): void;
  whereEqual<TOperand>(field: string, operand: TOperand): void;
  queryInclude(field: string, includes: string[]): void;
  queryExclude(field: string, excludes: string[]): void;
  queryLimit(field: string, limit: number): void;
  queryOffset(field: string, offset: number): void;
  queryOrder(field: string, order: OrderOperator, priority: number): void;
  querySearch(field: string, search: string): void;
}
