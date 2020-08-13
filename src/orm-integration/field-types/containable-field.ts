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
  unescapedListParser,
  OperatorValueParser,
  UnescapedListParserOptions,
  operatorParser,
} from '../../querystr-model';
import { ObjectFinder, EachDispatcher } from '../../query-builder';
import { FieldType } from './field-type';
import { FindOptions, Op, WhereAttributeHash } from 'sequelize';

import { Validator, DummyValidator } from '../validator';

const OPCODES = ['in', 'nin'] as const;

export type ContainableOpcode = typeof OPCODES[number];

const OPCODES_MAPPING: Record<ContainableOpcode, typeof Op[keyof typeof Op]> = {
  in: Op.in,
  nin: Op.notIn,
};

const dummyValidator = new DummyValidator();

export type ContainableFieldOptions = {
  readonly validator?: Validator;
  readonly allowOnly?: ContainableOpcode[];
} & Readonly<UnescapedListParserOptions>;

export type ContainableFieldIntOptions = {
  readonly parserOptions?: IntegerParserOptions;
} & ContainableFieldOptions;

export type ContainableFieldFloatOptions = {
  readonly parserOptions?: FloatParserOptions;
} & ContainableFieldOptions;

export type ContainableFieldStringOptions = ContainableFieldOptions;
export type ContainableFieldBoolOptions = ContainableFieldOptions;
export type ContainableFieldDateOptions = ContainableFieldOptions;

export class ContainableField<T = unknown> implements FieldType<T> {
  private readonly parser: OperatorValueParser<T[]>;
  private readonly validator: Validator;
  private readonly opcodes: Readonly<ContainableOpcode[]>;

  constructor(
    parser: ScalarParser<T>,
    {
      validator = dummyValidator,
      allowOnly,
      separator,
      maxElements,
    }: ContainableFieldOptions = {},
  ) {
    this.opcodes = allowOnly ?? OPCODES;
    this.parser = operatorParser(
      this.opcodes,
      unescapedListParser<T>(parser, { separator, maxElements }),
    );
    this.validator = validator;
  }

  static int(options?: ContainableFieldIntOptions): ContainableField<number> {
    return new ContainableField(integerParser(options?.parserOptions), options);
  }

  static float(
    options?: ContainableFieldFloatOptions,
  ): ContainableField<number> {
    return new ContainableField(floatParser(options?.parserOptions), options);
  }

  static bool(
    options?: ContainableFieldBoolOptions,
  ): ContainableField<boolean> {
    return new ContainableField(booleanParser(), options);
  }

  static string(
    options?: ContainableFieldStringOptions,
  ): ContainableField<string> {
    return new ContainableField(stringParser(), options);
  }

  static date(options?: ContainableFieldDateOptions): ContainableField<Date> {
    return new ContainableField(dateParser(), options);
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

        const opcodeSymbol = OPCODES_MAPPING[opcode as ContainableOpcode];

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
