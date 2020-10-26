import { DelegateBuilder, DelegateBuilderConfig } from './_delegate-builder';
import { FindOptionsBuilder } from '../sequelize-query-builder';
import { QueryAction } from '../../queops';
import { StandardBuilder } from './_standard-builder';
import { FindOptions } from 'sequelize';

export type FindOptionsBuilderOptions = DelegateBuilderConfig;

export { Populator, PopulatorsHash, SearchesHash } from './_delegate-builder';

export function createFindOptionsBuilder(
  params?: DelegateBuilderConfig,
): FindOptionsBuilder {
  const delegate = new DelegateBuilder(params);

  return function buildFindOptions<TAttributes = unknown>(
    action: QueryAction,
  ): FindOptions<TAttributes> {
    const builder = new StandardBuilder<TAttributes>(delegate);

    action(builder);

    return builder.getFindOptions();
  };
}
