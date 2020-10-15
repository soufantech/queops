import { QueryValue, OperatorSuperType } from '../../queries';
import { Result, success, failure } from '../../result';

export type OperandFilterMapper<TOperand> = (
  operand: TOperand,
) => Result<string, TOperand>;

export function createOperandFilter<TOperand>(
  filter: OperandFilterMapper<TOperand>,
): <TQ extends QueryValue<TOperand, OperatorSuperType>>(
  q: TQ,
) => Result<string, TQ> {
  return <TQ extends QueryValue<TOperand, OperatorSuperType>>(q: TQ) => {
    const filterResult = filter(q.operand);

    if (filterResult.isFailure()) {
      return failure(filterResult.unwrap());
    }

    q.operand = filterResult.unwrap();

    return success(q);
  };
}
