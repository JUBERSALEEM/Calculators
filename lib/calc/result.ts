/**
 * Discriminated Result type. Calculation modules return this instead of throwing
 * or producing NaN/null. Callers must handle both cases explicitly.
 */
export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E = string> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

export const isOk = <T, E = string>(r: Result<T, E>): r is Ok<T> => r.ok === true;
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r.ok === false;

/**
 * Map the success value of a Result, leaving errors untouched.
 */
export const map = <T, U, E>(r: Result<T, E>, f: (v: T) => U): Result<U, E> =>
  isOk(r) ? ok(f(r.value)) : r;
