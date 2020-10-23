import {
  QueryBuilder,
  ElementOperator,
  LogicalOperator,
  OrderOperator,
  RangeOperator,
  QueryAction,
} from '../queops';
import {
  FindOptions,
  Op,
  WhereValue,
  WhereAttributeHash,
  ProjectionAlias,
  Includeable,
  OrOperator,
} from 'sequelize';
import { isArray } from './_helpers';
import { FindOptionsBuilder } from './sequelize-query-builder';

const symbolOperatorMap: Record<
  LogicalOperator | ElementOperator | RangeOperator,
  symbol
> = {
  ne: Op.ne,
  eq: Op.eq,
  gt: Op.gt,
  gte: Op.gte,
  lt: Op.lt,
  lte: Op.lte,
  in: Op.in,
  nin: Op.notIn,
  bet: Op.between,
  nbet: Op.notBetween,
};

type OrderDirection = 'DESC' | 'ASC';

const orderOperatorMap: Record<OrderOperator, OrderDirection> = {
  asc: 'ASC',
  desc: 'DESC',
};

export type SearchesHash = Record<string, string[]>;

export type Populator = () => Includeable;

export type PopulatorsHash = Record<string, Populator>;

type BuilderDelegateParams = {
  populators?: PopulatorsHash;
  searches?: SearchesHash;
};

export type FindOptionsBuilderOptions = BuilderDelegateParams;

class BuilderDelegate {
  private readonly populators: PopulatorsHash;
  private readonly searches: SearchesHash;

  constructor(params: BuilderDelegateParams = {}) {
    this.populators = params.populators ?? {};
    this.searches = params.searches ?? {};
  }

  populate(field: string): Includeable | undefined {
    const populator = this.populators[field];

    if (populator === undefined) {
      return undefined;
    }

    return populator();
  }

  expandSearch(field: string): string[] | undefined {
    return this.searches[field];
  }
}

export function createFindOptionsBuilder(
  params?: BuilderDelegateParams,
): FindOptionsBuilder {
  const delegate = new BuilderDelegate(params);

  return function buildFindOptions<TAttributes = unknown>(
    action: QueryAction,
  ): FindOptions<TAttributes> {
    const builder = new StdFindOptionsBuilder<TAttributes>(delegate);

    action(builder);

    return builder.getFindOptions();
  };
}

function andWhere<TAttributes = unknown>(
  where: WhereAttributeHash<TAttributes>,
  field: string,
  value: WhereValue<TAttributes>,
): WhereAttributeHash<TAttributes> {
  const whereHash = where ?? {};

  if (whereHash[field as keyof WhereAttributeHash<TAttributes>] === undefined) {
    whereHash[field as keyof WhereAttributeHash<TAttributes>] = {};
  }

  whereHash[field as keyof WhereAttributeHash<TAttributes>] = {
    ...(whereHash[
      field as keyof WhereAttributeHash<TAttributes>
    ] as WhereAttributeHash<TAttributes>),
    ...(value as WhereAttributeHash<TAttributes>),
  };

  return whereHash;
}

class StdFindOptionsBuilder<TAttributes = unknown> implements QueryBuilder {
  private findOptions: FindOptions<TAttributes> = {};

  constructor(private readonly delegate: BuilderDelegate) {}

  getFindOptions(): FindOptions {
    return this.findOptions;
  }

  whereElement<TOperand>(
    field: string,
    operator: ElementOperator,
    elements: TOperand[],
  ): void {
    this.andWhere(field, { [symbolOperatorMap[operator]]: elements });
  }

  whereLogical<TOperand>(
    field: string,
    operator: LogicalOperator,
    operand: TOperand,
  ): void {
    this.andWhere(field, { [symbolOperatorMap[operator]]: operand });
  }

  whereRange<TOperand>(
    field: string,
    operator: RangeOperator,
    rangeTuple: [TOperand, TOperand],
  ): void {
    this.andWhere(field, { [symbolOperatorMap[operator]]: rangeTuple });
  }

  whereEqual<TOperand>(field: string, operand: TOperand): void {
    this.andWhere(field, { [Op.eq]: operand });
  }

  queryLimit(_field: string, limit: number): void {
    this.findOptions.limit = limit;
  }

  queryOffset(_field: string, offset: number): void {
    this.findOptions.offset = offset;
  }

  queryInclude(_field: string, includes: string[]): void {
    if (isArray(this.findOptions.attributes)) {
      this.findOptions.attributes = this.findOptions.attributes.concat(
        includes,
      );

      return;
    }

    this.findOptions.attributes = this.findOptions.attributes ?? {
      include: [],
    };
    this.findOptions.attributes.include = ([] as (
      | string
      | ProjectionAlias
    )[]).concat(this.findOptions.attributes.include ?? [], includes);
  }

  queryExclude(_field: string, excludes: string[]): void {
    if (isArray(this.findOptions.attributes)) {
      return;
    }

    this.findOptions.attributes = this.findOptions.attributes ?? {
      exclude: [],
    };
    this.findOptions.attributes.exclude = ([] as string[]).concat(
      this.findOptions.attributes.exclude ?? [],
      excludes,
    );
  }

  queryOrder(field: string, order: OrderOperator): void {
    if (!isArray(this.findOptions.order)) {
      this.findOptions.order = [];
    }

    this.findOptions.order.push([field, orderOperatorMap[order]]);
  }

  querySearch(field: string, term: string): void {
    const searchFields = this.delegate.expandSearch(field);

    if (searchFields === undefined) {
      return;
    }

    this.findOptions.where === undefined ? this.findOptions.where : {};

    const searchTerm = { [Op.substring]: term };

    (this.findOptions.where as OrOperator)[Op.or] = [];

    searchFields.forEach((searchField) => {
      ((this.findOptions.where as OrOperator)[Op.or] as WhereValue<
        TAttributes
      >[]).push({
        [searchField]: searchTerm,
      });
    });
  }

  queryPopulate(_field: string, populates: string[]): void {
    const includeables = populates
      .map((p) => {
        return this.delegate.populate(p);
      }, [] as Includeable[])
      .filter((e) => e !== undefined);

    if (includeables.length > 0) {
      this.findOptions.include = (includeables as Includeable[]).concat(
        this.findOptions.include ?? [],
      );
    }
  }

  populate(_field: string, populates: string[]): void {
    const includeables = populates
      .map((p) => {
        return this.delegate.populate(p);
      }, [] as Includeable[])
      .filter((e) => e !== undefined);

    if (includeables.length > 0) {
      this.findOptions.include = (includeables as Includeable[]).concat(
        this.findOptions.include ?? [],
      );
    }
  }

  private andWhere(field: string, condition: WhereValue<TAttributes>): void {
    this.findOptions.where = andWhere(
      this.findOptions.where ?? {},
      field,
      condition,
    );
  }
}
