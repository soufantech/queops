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
    // TODO: refactor to use Result monadic flow.
    const filterResult = filter(q.operand);

    if (filterResult.isFailure()) {
      return failure(filterResult.get());
    }

    q.operand = filterResult.get();

    return success(q);
  };
}
