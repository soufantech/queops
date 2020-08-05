import querystring, { ParsedUrlQuery } from 'querystring';
import { ParsedKeyValue } from './parsed-key-value';

export interface ValueParseResult<TValue = unknown> {
  opcode?: string | null;
  value?: TValue;
}

export interface ValueParser<TValueReturn = unknown> {
  (value: string): ValueParseResult<TValueReturn>;
}

export interface QuerySchema {
  readonly [key: string]: ValueParser | ValueParser[];
}

type NormalizedQuerySchema = {
  [key: string]: ValueParser[];
};

export class QuerystrModel {
  private readonly schema: NormalizedQuerySchema;

  constructor(schema: QuerySchema) {
    this.schema = this.normalizeSchema(schema);
  }

  private normalizeSchema(schema: QuerySchema): NormalizedQuerySchema {
    return Object.entries(schema).reduce((schema, [key, parser]) => {
      schema[key] = ([] as ValueParser[]).concat(
        parser as ValueParser | ValueParser[],
      );

      return schema;
    }, {} as NormalizedQuerySchema);
  }

  private parseKey(key: string, values: string | string[]): ParsedKeyValue[] {
    const parsers = this.schema[key];

    if (!parsers) {
      return [];
    }

    const normalizedValues: string[] = ([] as string[]).concat(
      values as string | string[],
    );

    return normalizedValues.reduce((parsedKeyValues, value) => {
      parsers.forEach((parser) => {
        const parsedValue = parser(value);

        if (parsedValue?.value !== undefined) {
          parsedKeyValues.push({
            key,
            originalValue: value,
            opcode: parsedValue.opcode ?? null,
            value: parsedValue.value,
          });
        }
      });

      return parsedKeyValues;
    }, [] as ParsedKeyValue[]);
  }

  parse(queryString: string | ParsedUrlQuery): ParsedKeyValue[] {
    const query =
      typeof queryString === 'string'
        ? querystring.decode(queryString)
        : queryString;

    return Object.entries(query).reduce((parsedKeyValues, [key, value]) => {
      return parsedKeyValues.concat(
        this.parseKey(key, value as string | string[]),
      );
    }, [] as ParsedKeyValue[]);
  }
}
