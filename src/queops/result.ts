/* eslint-disable @typescript-eslint/no-unused-vars */
export type Result<TFailure, TSuccess> =
  | FailureResult<TFailure, TSuccess>
  | SuccessResult<TFailure, TSuccess>;

export class FailureResult<TFailure, TSuccess> {
  readonly value: TFailure;

  constructor(value: TFailure) {
    this.value = value;
  }

  isFailure(): this is FailureResult<TFailure, TSuccess> {
    return true;
  }

  isSuccess(): this is SuccessResult<TFailure, TSuccess> {
    return false;
  }

  flatMap<TSuccess2>(
    _apply: (value: TSuccess) => TSuccess2,
  ): Result<TFailure, TSuccess2> {
    return this as never;
  }

  map<TSuccess2>(
    _apply: (value: TSuccess) => Result<TFailure, TSuccess2>,
  ): Result<TFailure, TSuccess2> {
    return this as never;
  }

  unwrap(): TFailure {
    return this.value;
  }
}

export class SuccessResult<TFailure, TSuccess> {
  readonly value: TSuccess;

  constructor(value: TSuccess) {
    this.value = value;
  }

  isFailure(): this is FailureResult<TFailure, TSuccess> {
    return false;
  }

  isSuccess(): this is SuccessResult<TFailure, TSuccess> {
    return true;
  }

  flatMap<TSuccess2>(
    apply: (value: TSuccess) => TSuccess2,
  ): Result<TFailure, TSuccess2> {
    return new SuccessResult(apply(this.value));
  }

  map<TSuccess2>(
    apply: (value: TSuccess) => Result<TFailure, TSuccess2>,
  ): Result<TFailure, TSuccess2> {
    return apply(this.value);
  }

  unwrap(): TSuccess {
    return this.value;
  }
}

export const failure = <TFailure, TSuccess>(
  value: TFailure,
): Result<TFailure, TSuccess> => {
  return new FailureResult(value);
};

export const success = <TFailure, TSuccess>(
  value: TSuccess,
): Result<TFailure, TSuccess> => {
  return new SuccessResult<TFailure, TSuccess>(value);
};
