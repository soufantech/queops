import { QueryAction } from '../queops';
import { FindOptions } from 'sequelize';
import {
  createFindOptionsBuilder,
  FindOptionsBuilderOptions,
} from './std-find-options-builder';
import { mergeFindOptions } from './find-options-merger';

export interface FindOptionsBuilder {
  <TAttributes = unknown>(action: QueryAction): FindOptions<TAttributes>;
}

export type SequelizeQueryBuilderParams = {
  findOptionsBuilder: FindOptionsBuilder;
};

export type CreateSequelizeQueryBuilderOptions = FindOptionsBuilderOptions;

export function createSequelizeQueryBuilder<TAttributes = unknown>(
  options?: FindOptionsBuilderOptions,
): SequelizeQueryBuilder {
  return new SequelizeQueryBuilder<TAttributes>({
    findOptionsBuilder: createFindOptionsBuilder(options),
  });
}

export class SequelizeQueryBuilder<TAttributes = unknown> {
  private readonly buildFindOptions: FindOptionsBuilder;

  constructor(params: SequelizeQueryBuilderParams) {
    this.buildFindOptions = params.findOptionsBuilder;
  }

  build(
    action: QueryAction,
    baseFindOptions?: FindOptions<TAttributes>,
  ): FindOptions<TAttributes> {
    return mergeFindOptions(
      baseFindOptions,
      this.buildFindOptions<TAttributes>(action),
    );
  }
}
