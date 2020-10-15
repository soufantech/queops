import { QueryValue, OperatorSuperType } from '../../queries';
import { Result } from '../../result';

export interface Filter<TOperand, TOperator extends OperatorSuperType> {
  <TQueryValue extends QueryValue<TOperand, TOperator>>(q: TQueryValue): Result<
    string,
    TQueryValue
  >;
}
