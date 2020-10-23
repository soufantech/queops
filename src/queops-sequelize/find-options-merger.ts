import {
  FindOptions,
  WhereOptions,
  FindAttributeOptions,
  ProjectionAlias,
  Order,
} from 'sequelize';
import { isObject, isArray } from './_helpers';

type ProjectionObject =
  | {
      exclude: string[];
      include?: (string | ProjectionAlias)[];
    }
  | {
      exclude?: string[];
      include: (string | ProjectionAlias)[];
    };

function isProjectionObject(value: unknown): value is ProjectionObject {
  return (
    (isObject(value) && isArray((value as ProjectionObject)?.include)) ||
    isArray((value as ProjectionObject)?.exclude)
  );
}

export function mergeFindOptions<TAttributes = unknown>(
  base: FindOptions<TAttributes> = {},
  top: FindOptions<TAttributes> = {},
): FindOptions<TAttributes> {
  return {
    ...base,
    ...top,
    where: mergeWhere(base.where, top.where),
    attributes: mergeAttributes(base.attributes, top.attributes),
    order: mergeOrder(base.order, top.order),
  };
}

function mergeAttributes(
  baseAttributes?: FindAttributeOptions,
  topAttributes?: FindAttributeOptions,
): FindAttributeOptions | undefined {
  if (topAttributes === undefined) {
    return baseAttributes;
  }

  if (isArray(topAttributes) && isArray(baseAttributes)) {
    return baseAttributes.concat(topAttributes);
  }

  if (isProjectionObject(topAttributes) && isProjectionObject(baseAttributes)) {
    return { ...baseAttributes, ...topAttributes };
  }

  return topAttributes;
}

function mergeOrder(baseOrder?: Order, topOrder?: Order): Order | undefined {
  if (topOrder === undefined) {
    return baseOrder;
  }

  if (isArray(topOrder) && isArray(baseOrder)) {
    return baseOrder.concat(topOrder);
  }

  return topOrder;
}

function mergeWhere<TAttributes = unknown>(
  baseWhere?: WhereOptions<TAttributes>,
  topWhere?: WhereOptions<TAttributes>,
): WhereOptions<TAttributes> | undefined {
  if (topWhere === undefined) {
    return baseWhere;
  }

  return { ...baseWhere, ...topWhere };
}
