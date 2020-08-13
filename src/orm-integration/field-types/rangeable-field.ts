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
  unescapedRangeParser,
  OperatorValueParser,
  UnescapedRangeParserOptions,
  operatorParser,
} from '../../querystr-model';
import { ObjectFinder, EachDispatcher } from '../../query-builder';
import { FieldType } from './field-type';
import { FindOptions, Op, WhereAttributeHash } from 'sequelize';

import { Validator, DummyValidator } from '../validator';

const OPCODES = ['bet', 'nbet'] as const;

export type RangeableOpcode = typeof OPCODES[number];

const OPCODES_MAPPING: Record<RangeableOpcode, typeof Op[keyof typeof Op]> = {
  bet: Op.between,
  nbet: Op.notBetween,
};

const dummyValidator = new DummyValidator();

export type RangeableFieldOptions = {
  readonly validator?: Validator;
  readonly allowOnly?: RangeableOpcode[];
} & Readonly<UnescapedRangeParserOptions>;

export type RangeableFieldIntOptions = {
  readonly parserOptions?: IntegerParserOptions;
} & RangeableFieldOptions;

export type RangeableFieldFloatOptions = {
  readonly parserOptions?: FloatParserOptions;
} & RangeableFieldOptions;

export type RangeableFieldStringOptions = RangeableFieldOptions;
export type RangeableFieldBoolOptions = RangeableFieldOptions;
export type RangeableFieldDateOptions = RangeableFieldOptions;

export class RangeableField<T = unknown> implements FieldType<T> {
  private readonly parser: OperatorValueParser<T[]>;
  private readonly validator: Validator;
  private readonly opcodes: Readonly<RangeableOpcode[]>;

  constructor(
    parser: ScalarParser<T>,
    {
      validator = dummyValidator,
      allowOnly,
      separator,
    }: RangeableFieldOptions = {},
  ) {
    this.opcodes = allowOnly ?? OPCODES;
    this.parser = operatorParser(
      this.opcodes,
      unescapedRangeParser<T>(parser, { separator }),
    );
    this.validator = validator;
  }

  static int(options?: RangeableFieldIntOptions): RangeableField<number> {
    return new RangeableField(integerParser(options?.parserOptions), options);
  }

  static float(options?: RangeableFieldFloatOptions): RangeableField<number> {
    return new RangeableField(floatParser(options?.parserOptions), options);
  }

  static bool(options?: RangeableFieldBoolOptions): RangeableField<boolean> {
    return new RangeableField(booleanParser(), options);
  }

  static string(options?: RangeableFieldStringOptions): RangeableField<string> {
    return new RangeableField(stringParser(), options);
  }

  static date(options?: RangeableFieldDateOptions): RangeableField<Date> {
    return new RangeableField(dateParser(), options);
  }

  getParser(): OperatorValueParser<T[]> {
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

        const opcodeSymbol = OPCODES_MAPPING[opcode as RangeableOpcode];

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
