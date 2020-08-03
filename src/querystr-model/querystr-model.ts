import querystring, { ParsedUrlQuery } from 'querystring';
import { ValueParser, identityParser } from './value-parser';

export type ValueSchemaObjParam = {
  readonly opcode: string[] | string | null;
  readonly parser: ValueParser;
};

export type ValueSchemaParam =
  | ValueSchemaObjParam
  | string
  | null
  | ValueParser;

export interface QuerySchemaParam {
  readonly [key: string]: ValueSchemaParam | ValueSchemaParam[];
}

export interface ParsedKeyValue {
  opcode: string | null;
  key: string;
  originalValue: string;
  value: unknown;
}

type ValueSchema = {
  readonly opcode: string[] | null;
  readonly parser: ValueParser;
};

type Key = string;
type QuerySchema = Record<Key, ValueSchema[]>;

type Operation = {
  opcode: string;
  arg: string;
};

function parseOperation(value: string): Operation {
  const index = value.indexOf(':');

  return {
    opcode: value.substring(0, index),
    arg: value.substring(index + 1),
  };
}

function normalizeValueSchema(arg: ValueSchemaParam): ValueSchema {
  if (typeof arg === 'string') {
    return { opcode: [arg], parser: identityParser };
  }

  if (typeof arg === 'function') {
    return { opcode: null, parser: arg };
  }

  if (arg === null) {
    return { opcode: null, parser: identityParser };
  }

  return {
    opcode: arg.opcode != null ? ([] as string[]).concat(arg.opcode) : null,
    parser: arg.parser ?? identityParser,
  };
}

export class QuerystrModel {
  private readonly schema: QuerySchema;

  constructor(schema: QuerySchemaParam) {
    this.schema = this.buildSchema(schema);
  }

  private buildSchema(schema: QuerySchemaParam): QuerySchema {
    return Object.entries(schema).reduce((schema, [key, valueSchemaArgs]) => {
      valueSchemaArgs = ([] as ValueSchemaParam[]).concat(valueSchemaArgs);

      schema[key] = valueSchemaArgs.map((valueSchemaArg, pos) => {
        if (valueSchemaArg === undefined) {
          throw new TypeError(
            `Invalid argument: invalid value schema definition in position ${pos} for key \`${key}\``,
          );
        }

        return normalizeValueSchema(valueSchemaArg);
      });

      return schema;
    }, {} as QuerySchema);
  }

  parse(queryString: string | ParsedUrlQuery): ParsedKeyValue[] {
    const query =
      typeof queryString === 'string'
        ? querystring.decode(queryString)
        : queryString;

    return Object.entries(query).reduce((parsed, [key, value]) => {
      const valueSchemas = this.schema[key];

      if (!valueSchemas) {
        return parsed;
      }

      const values = ([] as string[]).concat(value as string | string[]);

      values.forEach((value) => {
        const { opcode, arg: opArg } = parseOperation(value);

        valueSchemas.forEach((valueSchema) => {
          if (
            valueSchema.opcode !== null &&
            !valueSchema.opcode.includes(opcode)
          ) {
            return;
          }

          const parsedValue = valueSchema.parser(
            valueSchema.opcode === null ? value : opArg,
          );

          if (parsedValue === undefined) {
            return;
          }

          parsed.push({
            key: key,
            opcode: valueSchema.opcode !== null ? opcode : null,
            originalValue: value,
            value: parsedValue,
          });
        });
      });

      return parsed;
    }, [] as ParsedKeyValue[]);
  }
}
