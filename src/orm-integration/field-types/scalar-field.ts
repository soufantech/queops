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
} from '../../querystr-model';
import { FirstDispatcher, ObjectFinder } from '../../query-builder';
import { FieldType } from './field-type';
import { FindOptions, Op, WhereAttributeHash } from 'sequelize';

import { Validator, DummyValidator } from '../validator';

const dummyValidator = new DummyValidator();

export type ScalarFieldOptions = {
  validator?: Validator;
};

export type ScalarFieldIntOptions = {
  parserOptions?: IntegerParserOptions;
} & ScalarFieldOptions;

export type ScalarFieldFloatOptions = {
  parserOptions?: FloatParserOptions;
} & ScalarFieldOptions;

export type ScalarFieldStringOptions = ScalarFieldOptions;
export type ScalarFieldBoolOptions = ScalarFieldOptions;
export type ScalarFieldDateOptions = ScalarFieldOptions;

export class ScalarField<T = unknown> implements FieldType<T> {
  private readonly parser: ScalarParser<T>;
  private readonly validator: Validator;

  constructor(
    parser: ScalarParser<T>,
    { validator = dummyValidator }: ScalarFieldOptions = {},
  ) {
    this.parser = parser;
    this.validator = validator;
  }

  static int(options?: ScalarFieldIntOptions): ScalarField<number> {
    return new ScalarField(integerParser(options?.parserOptions), options);
  }

  static float(options?: ScalarFieldFloatOptions): ScalarField<number> {
    return new ScalarField(floatParser(options?.parserOptions), options);
  }

  static bool(options?: ScalarFieldBoolOptions): ScalarField<boolean> {
    return new ScalarField(booleanParser(), options);
  }

  static string(options?: ScalarFieldStringOptions): ScalarField<string> {
    return new ScalarField(stringParser(), options);
  }

  static date(options?: ScalarFieldDateOptions): ScalarField<Date> {
    return new ScalarField(dateParser(), options);
  }

  getParser(): ScalarParser<T> {
    return this.parser;
  }

  getDispatcher(
    key: string,
    alias?: string,
  ): FirstDispatcher<ParsedKeyValue, FindOptions> {
    const keyAlias = alias ?? key;

    return new FirstDispatcher<ParsedKeyValue, FindOptions>(
      new ObjectFinder({ key, opcode: null }),
      ({ value }, query) => {
        const { value: validValue, error } = this.validator.validate<T>(
          value as T,
        );

        if (error) {
          return;
        }

        query.where = query.where ?? {};

        if ((query.where as WhereAttributeHash)[keyAlias] === undefined) {
          (query.where as WhereAttributeHash)[keyAlias] = {};
        }

        ((query.where as WhereAttributeHash)[keyAlias] as WhereAttributeHash)[
          Op.eq as never
        ] = validValue;
      },
    );
  }
}
