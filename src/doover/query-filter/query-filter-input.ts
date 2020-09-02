export type QueryFilterInput<TOperand = unknown> = {
  field: string;
  operand: TOperand;
  operator: string | null;
};
