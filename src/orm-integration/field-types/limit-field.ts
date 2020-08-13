import {
  ScalarParser,
  ParsedKeyValue,
  IntegerParserOptions,
  integerParser,
} from '../../querystr-model';
import { FirstDispatcher, ObjectFinder } from '../../query-builder';
import { FieldType } from './field-type';
import { FindOptions } from 'sequelize';

import { Validator, DummyValidator } from '../validator';

const dummyValidator = new DummyValidator();

export type LimitFieldOptions = {
  validator?: Validator;
  parserOptions?: IntegerParserOptions;
};

export class LimitField implements FieldType<number> {
  private readonly parser: ScalarParser<number>;
  private readonly validator: Validator;

  constructor({
    validator = dummyValidator,
    parserOptions,
  }: LimitFieldOptions = {}) {
    this.parser = integerParser(parserOptions);
    this.validator = validator;
  }

  getParser(): ScalarParser<number> {
    return this.parser;
  }

  getDispatcher(key: string): FirstDispatcher<ParsedKeyValue, FindOptions> {
    return new FirstDispatcher<ParsedKeyValue, FindOptions>(
      new ObjectFinder({ key, opcode: null }),
      ({ value }, query) => {
        const { value: validValue, error } = this.validator.validate<number>(
          value as number,
        );

        if (error) {
          return;
        }

        query.limit = validValue;
      },
    );
  }
}
