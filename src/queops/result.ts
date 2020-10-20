export type Result<TFailure, TSuccess> =
  | SuccessResult<TFailure, TSuccess>
  | FailureResult<TFailure, TSuccess>;

export function isResult(value: unknown): value is Result<unknown, unknown> {
  return value instanceof SuccessResult || value instanceof FailureResult;
}

export class SuccessResult<TFailure, TSuccess> {
  static create<TFailure, TSuccess>(
    value: TSuccess,
  ): Result<TFailure, TSuccess> {
    return new SuccessResult<TFailure, TSuccess>(value);
  }

  private value: TSuccess;

  constructor(success: TSuccess) {
    this.value = success;
  }

  isSuccess(): this is SuccessResult<TFailure, TSuccess> {
    return true;
  }

  isFailure(): this is FailureResult<TFailure, TSuccess> {
    return false;
  }

  flatMap<S>(f: (s: TSuccess) => S): Result<TFailure, S> {
    return SuccessResult.create<TFailure, S>(f(this.value));
  }

  map<S>(f: (s: TSuccess) => Result<TFailure, S>): Result<TFailure, S> {
    return f(this.value);
  }

  mapFailure<F>(_f: (s: TFailure) => Result<F, TSuccess>): Result<F, TSuccess> {
    return (this as unknown) as Result<F, TSuccess>;
  }

  flatMapFailure<F>(_f: (s: TFailure) => F): Result<F, TSuccess> {
    return (this as unknown) as Result<F, TSuccess>;
  }

  mapAsync<S>(
    f: (s: TSuccess) => Promise<Result<TFailure, S>>,
  ): Promise<Result<TFailure, S>> {
    return Promise.resolve(this.value).then(f);
  }

  fold<S>(onSuccess: (s: TSuccess) => S, _onFailure: (f: TFailure) => S): S {
    return onSuccess(this.value);
  }

  recover(_transform: (f: TFailure) => TSuccess): Result<TFailure, TSuccess> {
    return this;
  }

  recoverCatching(
    _transform: (f: TFailure) => TSuccess,
  ): Result<Error, TSuccess> {
    return (this as unknown) as Result<Error, TSuccess>;
  }

  onSuccess(f: (s: TSuccess) => void): Result<TFailure, TSuccess> {
    f(this.value);

    return this;
  }

  onFailure(_f: (failure: TFailure) => void): Result<TFailure, TSuccess> {
    return this;
  }

  get(): TSuccess {
    return this.value;
  }

  getOrDefault(_defaultValue: TSuccess): TSuccess {
    return this.value;
  }

  getOrElse(_onFailure: (f: TFailure) => TSuccess): TSuccess {
    return this.value;
  }

  getOrThrow(_transform?: <F>(e: TFailure) => F): TSuccess {
    return this.value;
  }
}

export class FailureResult<TFailure, TSuccess> {
  static create<TFailure, TSuccess>(
    value: TFailure,
  ): Result<TFailure, TSuccess> {
    return new FailureResult<TFailure, TSuccess>(value);
  }

  private value: TFailure;

  constructor(failure: TFailure) {
    this.value = failure;
  }

  isSuccess(): this is SuccessResult<TFailure, TSuccess> {
    return false;
  }

  isFailure(): this is FailureResult<TFailure, TSuccess> {
    return true;
  }

  flatMap<S>(_f: (s: TSuccess) => S): Result<TFailure, S> {
    return (this as unknown) as Result<TFailure, S>;
  }

  map<S>(_f: (s: TSuccess) => Result<TFailure, S>): Result<TFailure, S> {
    return (this as unknown) as Result<TFailure, S>;
  }

  mapFailure<F>(f: (s: TFailure) => Result<F, TSuccess>): Result<F, TSuccess> {
    return f(this.value);
  }

  flatMapFailure<F>(f: (s: TFailure) => F): Result<F, TSuccess> {
    return new FailureResult(f(this.value));
  }

  mapAsync<S>(
    _f: (s: TSuccess) => Promise<Result<TFailure, S>>,
  ): Promise<Result<TFailure, S>> {
    return Promise.resolve((this as unknown) as Result<TFailure, S>);
  }

  fold<S>(_onSuccess: (s: TSuccess) => S, onFailure: (f: TFailure) => S): S {
    return onFailure(this.value);
  }

  recover(transform: (f: TFailure) => TSuccess): Result<TFailure, TSuccess> {
    return new SuccessResult(transform(this.value));
  }

  recoverCatching(
    transform: (f: TFailure) => TSuccess,
  ): Result<Error, TSuccess> {
    return runCatching<TSuccess>(() => {
      return transform(this.value);
    });
  }

  onSuccess(_f: (s: TSuccess) => void): Result<TFailure, TSuccess> {
    return this;
  }

  onFailure(f: (failure: TFailure) => void): Result<TFailure, TSuccess> {
    f(this.value);

    return this;
  }

  get(): TFailure {
    return this.value;
  }

  getOrDefault(defaultValue: TSuccess): TSuccess {
    return defaultValue;
  }

  getOrElse(onFailure: (f: TFailure) => TSuccess): TSuccess {
    return onFailure(this.value);
  }

  getOrThrow<F>(transform?: (e: TFailure) => F): TSuccess {
    throw transform ? transform(this.value) : this.value;
  }
}

export const failure = FailureResult.create;
export const success = SuccessResult.create;

/**
 * Converts the result of a promise into a result.
 * If the promise is rejected, the rejected value is a failure `Result`.
 * If the promise is resolved, the resolved value is a success `Result`.
 *
 * @example <caption>When the promise returns a value or throws:</caption>
 *
 * // Assuming `findUserById` returns a rejected promise if user is not found.
 * const result = await fromPromise(findUserById(5));
 *
 * const user = result.getOrFail();
 */
export function fromPromise<F, S>(s: Promise<S>): Promise<Result<F, S>> {
  return s.then((h) => success<F, S>(h)).catch((c) => failure<F, S>(c));
}

/**
 * Runs a synchronous function, converting its result or thrown exception
 * into a `Result`.
 *
 * @example <caption>When code throws an exception</caption>
 *
 * // Assuming user DOESN'T have the permissions to read the '/etc/passwd' file:
 *
 * const readingResult = runCatching(() => {
 *   return fs.readFileSync('/etc/passwd');
 * });
 *
 * readingResult.isFailure(); // true
 *
 * const fileContent = readingResult.getOrFail(); // throws Error: EACCESS
 *
 * @example <caption>When code throws an exception</caption>
 *
 * // Assuming user DOES have the permissions to read the '/etc/passwd' file:
 *
 * const readingResult = runCatching(() => {
 *   return fs.readFileSync('/etc/passwd');
 * });
 *
 * readingResult.isSuccess(); // true
 *
 * const fileContent = readingResult.getOrFail(); // returns file content
 *
 * @example <caption>Using just for the collateral effect</caption>
 *
 * const result = runCatching(() => {
 *   jwt.verify(token, 'wrong-secret'); // returning nothing here.
 * });
 *
 * result.isSuccess() // false
 */
export function runCatching<TSuccess>(
  run: () => TSuccess,
): Result<Error, TSuccess> {
  try {
    return success(run());
  } catch (err) {
    return failure(err);
  }
}

/**
 * The async version of `runCatching`.
 *
 * @see runCatching
 * @see fromPromise
 * @example
 *
 * // Assuming `makeRemoteRequest` returns a rejected promise:
 *
 * const responseResult = await runCatchingAsync(() => {
 *   return makeRemoteRequest(); // returns a `Promise`
 * });
 *
 * responseResult.isFailure(); // true
 *
 * const httpResponse = responseResult.getOrFail(); // throws an error because promise was rejected.
 *
 */
export function runCatchingAsync<TSuccess>(
  run: () => Promise<TSuccess>,
): Promise<Result<Error, TSuccess>> {
  return fromPromise(run());
}

// export function either2<F, S, C extends (...args: any[]) => Promise<S>>(
//   func: C,
// ): (...args: Parameters<C>) => Promise<Result<F, S>> {
//   return (...args: Parameters<C>): Promise<Result<F, S>> => {
//     return either<F, S>(func(...args));
//   };
// }

// const f = (s: string) => Promise.resolve(s);
// const s = either2<Error, string>(f);

// async function fn1(a: string): Promise<Result<Error, string>> {
//   return Promise.resolve(success<Error, string>(a));
// }

// async function fn2(_a: string): Promise<Result<Error, string>> {
//   return Promise.resolve(failure<Error, string>(new Error('a')));
// }

// async function master() {
//   const res = (await either<Error, string>(fn1('hey')))
//     .flatMap((s: string) => s.toUpperCase())
//     .map(((s: string) => success(s)).call(null, await fn2('hey')));

//   return res.getOrThrow();
// }

// f x = 5 + x
// g x = 7 + x

// h = f . g

// h(6) // 18
