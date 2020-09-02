export type LogicalComparisonOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte';
export type RangeComparisonOperator = 'bet' | 'nbet';
export type ElementComparisonOperator = 'in' | 'nin';
export type OrderingOperator = 'asc' | 'desc';

export interface QueryBuilderInterface {
  compareStrict<TOperand = unknown>(field: string, operand: TOperand): void;
  compareElement<TOperand = unknown>(
    field: string,
    operands: readonly TOperand[],
    operator: ElementComparisonOperator,
  ): void;
  compareRange<TOperand = unknown>(
    field: string,
    operands: readonly [TOperand, TOperand],
    operator: RangeComparisonOperator,
  ): void;
  compareLogical<TOperand = unknown>(
    field: string,
    operand: TOperand,
    operator: LogicalComparisonOperator,
  ): void;
  order(field: string, operand: number, operator: OrderingOperator): void;
  limit(max: number): void;
  offset(page: number): void;
  includeFields(fields: readonly string[]): void;
  excludeFields(fields: readonly string[]): void;
  selectAll(): void; // TODO: <- is this one necessary?
}
