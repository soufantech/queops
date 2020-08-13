import {
  ScalarParser,
  ParsedKeyValue,
  IntegerParserOptions,
  integerParser,
  floatParser,
  FloatParserOptions,
  stringParser,
  booleanParser,
  dateParser,
  OperatorValueParser,
  operatorParser,
} from '../../querystr-model';
import { ObjectFinder, EachDispatcher } from '../../query-builder';
import { FieldType } from './field-type';
import { FindOptions, Op, WhereAttributeHash } from 'sequelize';

import { Validator, DummyValidator } from '../validator';

const OPCODES = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'] as const;

export type ComparableOpcode = typeof OPCODES[number];

const OPCODES_MAPPING: Record<ComparableOpcode, typeof Op[keyof typeof Op]> = {
  eq: Op.eq,
  ne: Op.ne,
  lt: Op.lt,
  lte: Op.lte,
  gt: Op.gt,
  gte: Op.gte,
};

const dummyValidator = new DummyValidator();

export type ComparableFieldOptions = {
  readonly validator?: Validator;
  readonly allowOnly?: ComparableOpcode[];
};

export type ComparableFieldIntOptions = {
  readonly parserOptions?: IntegerParserOptions;
} & ComparableFieldOptions;

export type ComparableFieldFloatOptions = {
  readonly parserOptions?: FloatParserOptions;
} & ComparableFieldOptions;

export type ComparableFieldStringOptions = ComparableFieldOptions;
export type ComparableFieldBoolOptions = ComparableFieldOptions;
export type ComparableFieldDateOptions = ComparableFieldOptions;

export class ComparableField<T = unknown> implements FieldType<T> {
  private readonly parser: OperatorValueParser<T>;
  private readonly validator: Validator;
  private readonly opcodes: Readonly<ComparableOpcode[]>;

  constructor(
    parser: ScalarParser<T>,
    { validator = dummyValidator, allowOnly }: ComparableFieldOptions = {},
  ) {
    this.opcodes = allowOnly ?? OPCODES;
    this.parser = operatorParser(this.opcodes, parser);
    this.validator = validator;
  }

  static int(options?: ComparableFieldIntOptions): ComparableField<number> {
    return new ComparableField(integerParser(options?.parserOptions), options);
  }

  static float(options?: ComparableFieldFloatOptions): ComparableField<number> {
    return new ComparableField(floatParser(options?.parserOptions), options);
  }

  static bool(options?: ComparableFieldBoolOptions): ComparableField<boolean> {
    return new ComparableField(booleanParser(), options);
  }

  static string(
    options?: ComparableFieldStringOptions,
  ): ComparableField<string> {
    return new ComparableField(stringParser(), options);
  }

  static date(options?: ComparableFieldDateOptions): ComparableField<Date> {
    return new ComparableField(dateParser(), options);
  }

  getParser(): OperatorValueParser<T> {
    return this.parser;
  }

  getDispatcher(
    key: string,
    alias?: string,
  ): EachDispatcher<ParsedKeyValue, FindOptions> {
    const keyAlias = alias ?? key;

    return new EachDispatcher<ParsedKeyValue, FindOptions>(
      new ObjectFinder({ key, opcode: this.opcodes }),
      ({ value, opcode }, query) => {
        const { value: validValue, error } = this.validator.validate<T>(
          value as T,
        );

        if (error) {
          return;
        }

        const opcodeSymbol = OPCODES_MAPPING[opcode as ComparableOpcode];

        query.where = query.where ?? {};

        if ((query.where as WhereAttributeHash)[keyAlias] === undefined) {
          (query.where as WhereAttributeHash)[keyAlias] = {};
        }

        ((query.where as WhereAttributeHash)[keyAlias] as WhereAttributeHash)[
          opcodeSymbol as never
        ] = validValue;
      },
    );
  }
}
