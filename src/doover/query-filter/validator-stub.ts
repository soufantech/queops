import { ValidationResult, Validator } from './validator';

export class ValidatorStub implements Validator {
  validate<T = unknown>(value: T): ValidationResult<T> {
    return {
      value,
      error: null,
    };
  }
}

export default new ValidatorStub();
