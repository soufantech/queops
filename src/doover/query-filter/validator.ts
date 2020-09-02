export interface ValidationResult<T> {
  value: T;
  error: null | Error;
}

export interface Validator {
  validate<T = unknown>(value: T): ValidationResult<T>;
}
