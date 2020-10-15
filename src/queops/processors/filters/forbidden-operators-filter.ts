import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperatorFilter } from './operator-filter';

export function createForbiddenOperatorsFilter<
  TOperator extends OperatorSuperType
>(forbiddenOperators: TOperator[]): Filter<unknown, TOperator> {
  return createOperatorFilter<TOperator>((operator: TOperator) => {
    if (forbiddenOperators.includes(operator as TOperator)) {
      return failure(`Operator "${operator}" is not allowed`);
    }

    return success(operator);
  });
}
