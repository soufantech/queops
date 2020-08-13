import { FieldType } from './field-types/field-type';
import { QueryBuilder } from '../query-builder';
import {
  ParsedKeyValue,
  QuerySchema,
  QuerystrModel,
  ValueParser,
} from '../querystr-model';
import { FindOptions } from 'sequelize';

export type FieldSchema<T = unknown> = {
  type: FieldType<T> | FieldType<T>[];
  alias?: string;
};

export type AutoQueryBuilderSchema = {
  [key: string]: FieldSchema;
};

type ReadWrite<T> = { -readonly [P in keyof T]: T[P] };

export class AutoQueryBuilder {
  private readonly queryBuilder: QueryBuilder<ParsedKeyValue, FindOptions>;
  private readonly queryModel: QuerystrModel;

  constructor(schema: AutoQueryBuilderSchema) {
    this.queryBuilder = new QueryBuilder();

    const querySchema = {} as ReadWrite<QuerySchema>;

    Object.entries(schema).forEach(([key, fieldSchema]) => {
      ([] as FieldType[]).concat(fieldSchema.type).forEach((fieldType) => {
        if (!Array.isArray(querySchema[key as keyof QuerySchema])) {
          querySchema[key as keyof QuerySchema] = [];
        }

        (querySchema[key as keyof QuerySchema] as ValueParser[]).push(
          fieldType.getParser(),
        );

        this.queryBuilder.register(
          fieldType.getDispatcher(key, fieldSchema.alias),
        );
      });
    });

    this.queryModel = new QuerystrModel(querySchema);
  }

  buildFromQueryString(
    querystring: Parameters<QuerystrModel['parse']>[0],
    context?: FindOptions,
  ): FindOptions {
    const parseQuerystr = this.queryModel.parse(querystring);
    const queryContext = context ?? {};

    this.queryBuilder.build(parseQuerystr, queryContext);

    return queryContext;
  }
}
