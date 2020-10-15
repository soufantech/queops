import { QueryValue, OperatorSuperType } from '../../queries';
import { Result, success, failure } from '../../result';

export type OperatorFilterMapper<TOperator extends OperatorSuperType> = (
  operator: TOperator,
) => Result<string, TOperator>;

export function createOperatorFilter<TOperator extends OperatorSuperType>(
  filter: OperatorFilterMapper<TOperator>,
): <TQ extends QueryValue<unknown, TOperator>>(q: TQ) => Result<string, TQ> {
  return <TQ extends QueryValue<unknown, TOperator>>(q: TQ) => {
    const filterResult = filter(q.operator);

    if (filterResult.isFailure()) {
      return failure(filterResult.unwrap());
    }

    q.operator = filterResult.unwrap();

    return success(q);
  };
}
