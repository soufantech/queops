export type OperatorSuperType = string | null;

export type QueryValue<TOperand, TOperator extends OperatorSuperType> = {
  operator: TOperator;
  operand: TOperand;
};

export type QueryField = {
  field: string;
};

export type Query<TOperand, TOperator extends OperatorSuperType> = QueryValue<
  TOperand,
  TOperator
> &
  QueryField;
