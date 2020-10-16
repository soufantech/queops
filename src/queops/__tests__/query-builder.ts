/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import {
  ElementOperator,
  LogicalOperator,
  OrderOperator,
  RangeOperator,
} from '../queries';

import { QueryBuilder } from '../query-builder';

export class MockQueryBuilder implements QueryBuilder {
  private readonly logs: any = [];

  whereElement<TOperand>(
    field: string,
    operator: ElementOperator,
    elements: TOperand[],
  ): void {
    this.logs.push({ method: 'whereElement', field, operator, elements });
  }

  whereLogical<TOperand>(
    field: string,
    operator: LogicalOperator,
    operand: TOperand,
  ): void {
    this.logs.push({ method: 'whereLogical', field, operator, operand });
  }

  whereRange<TOperand>(
    field: string,
    operator: RangeOperator,
    rangeTuple: [TOperand, TOperand],
  ): void {
    this.logs.push({ method: 'whereRange', field, operator, rangeTuple });
  }

  whereEqual<TOperand>(field: string, operand: TOperand): void {
    this.logs.push({ method: 'whereEqual', field, operand });
  }

  queryPopulate(field: string, populateList: string[]): void {
    this.logs.push({ method: 'queryPopulate', field, populateList });
  }

  queryLimit(field: string, limit: number): void {
    this.logs.push({ method: 'queryLimit', field, limit });
  }

  queryOffset(field: string, offset: number): void {
    this.logs.push({ method: 'queryOffset', field, offset });
  }

  queryOrder(field: string, order: OrderOperator, priority: number): void {
    this.logs.push({ method: 'queryOrder', field, order, priority });
  }

  querySearch(field: string, search: string): void {
    this.logs.push({ method: 'querySearch', field, search });
  }

  queryInclude(field: string, includes: string[]): void {
    this.logs.push({ method: 'queryInclude', field, includes });
  }

  queryExclude(field: string, excludes: string[]): void {
    this.logs.push({ method: 'queryExclude', field, excludes });
  }

  getLogs(): any[] {
    return this.logs;
  }
}
