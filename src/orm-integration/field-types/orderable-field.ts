import {
  ScalarParser,
  ParsedKeyValue,
  EnumParserOptions,
  OperatorValueParser,
  enumParser,
  operatorParser,
} from '../../querystr-model';
import { FirstDispatcher, ObjectFinder } from '../../query-builder';
import { FieldType } from './field-type';
import { FindOptions, OrderItem } from 'sequelize';

import { Validator, DummyValidator } from '../validator';

const dummyValidator = new DummyValidator();

const OPCODE = 'order';

const ORDER_VALUES = ['asc', 'desc'] as const;

type OrderValue = typeof ORDER_VALUES[number];

const ORDER_VALUES_MAPPING = {
  asc: 'ASC',
  desc: 'DESC',
};

export type OrderableFieldOptions = {
  validator?: Validator;
  parserOptions?: EnumParserOptions;
  allowOnly?: OrderValue;
};

export class OrderableField implements FieldType<string> {
  private readonly parser: OperatorValueParser<string>;
  private readonly validator: Validator;

  constructor({
    validator = dummyValidator,
    parserOptions,
    allowOnly,
  }: OrderableFieldOptions = {}) {
    this.parser = operatorParser(
      OPCODE,
      enumParser(
        ([] as OrderValue[]).concat(allowOnly ?? ORDER_VALUES),
        parserOptions,
      ),
    );
    this.validator = validator;
  }

  getParser(): ScalarParser<string> {
    return this.parser;
  }

  getDispatcher(
    key: string,
    alias?: string,
  ): FirstDispatcher<ParsedKeyValue, FindOptions> {
    const keyAlias = alias ?? key;

    return new FirstDispatcher<ParsedKeyValue, FindOptions>(
      new ObjectFinder({ key, opcode: OPCODE }),
      ({ value }, query) => {
        const { value: validValue, error } = this.validator.validate<
          OrderValue
        >(value as OrderValue);

        if (error) {
          return;
        }

        if (!Array.isArray(query.order)) {
          query.order = [];
        }

        (query.order as OrderItem[]).push([
          keyAlias,
          ORDER_VALUES_MAPPING[validValue],
        ]);
      },
    );
  }
}
