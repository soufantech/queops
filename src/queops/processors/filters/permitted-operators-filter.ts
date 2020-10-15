import { OperatorSuperType } from '../../queries';
import { Filter } from './filter';
import { success, failure } from '../../result';
import { createOperatorFilter } from './operator-filter';

export function createPermittedOperatorsFilter<
  TOperator extends OperatorSuperType
>(permittedOperators: TOperator[]): Filter<unknown, TOperator> {
  return createOperatorFilter<TOperator>((operator: TOperator) => {
    if (permittedOperators.includes(operator as TOperator)) {
      return success(operator);
    }

    return failure(`Operator "${operator}" not allowed`);
  });
}
