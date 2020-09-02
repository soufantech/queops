import {
  QueryBuilderInterface,
  LogicalComparisonOperator,
  ElementComparisonOperator,
  OrderingOperator,
  RangeComparisonOperator,
} from '../query-builder-interface';

export class QueryBuilder implements QueryBuilderInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly logs: any = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(record?: any) {
    this.logs.push(record);
  }

  compareStrict<TOperand = unknown>(field: string, operand: TOperand): void {
    this.log({ _name: 'compareStrict', field, operand });
  }

  compareElement<TOperand = unknown>(
    field: string,
    operands: readonly TOperand[],
    operator: ElementComparisonOperator,
  ): void {
    this.log({ _name: 'compareElement', field, operands, operator });
  }

  compareRange<TOperand = unknown>(
    field: string,
    operands: readonly [TOperand, TOperand],
    operator: RangeComparisonOperator,
  ): void {
    this.log({ _name: 'compareRange', field, operands, operator });
  }

  compareLogical<TOperand = unknown>(
    field: string,
    operand: TOperand,
    operator: LogicalComparisonOperator,
  ): void {
    this.log({ _name: 'compareLogical', field, operand, operator });
  }

  order(field: string, operand: number, operator: OrderingOperator): void {
    this.log({ _name: 'order', field, operand, operator });
  }

  limit(max: number): void {
    this.log({ _name: 'limit', max });
  }

  offset(page: number): void {
    this.log({ _name: 'offset', page });
  }

  includeFields(fields: readonly string[]): void {
    this.log({ _name: 'includeFields', fields });
  }

  excludeFields(fields: readonly string[]): void {
    this.log({ _name: 'excludeFields', fields });
  }

  selectAll(): void {
    this.log({ _name: 'selectAll' });
  }
}
