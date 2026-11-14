import { isPromise } from "../internals/is-promise";
import type { Option, OptionAsync } from "../option";
import { none } from "./none";
import { some } from "./some";

/**
 * Wraps a function so that its return value becomes an {@link Option}.
 *
 * The wrapped function keeps its parameters and returns a {@link Some} of
 * its return value, or a {@link None} when it returns `null` or `undefined`.
 * When it returns a `Promise`, the result is an {@link OptionAsync}: the
 * promise resolves to a `Some` of the resolved value, or to a `None` when it
 * rejects or resolves with a nullish value. A synchronous throw is not
 * captured and propagates to the caller.
 *
 * @typeParam F - The type of the function to wrap.
 *
 * @param fn - The function to wrap.
 *
 * @returns A function with the same parameters that returns an `Option` (or
 * an `OptionAsync` when the wrapped function is asynchronous).
 *
 * @example Synchronous function
 * ```ts
 * import { Option } from 'byenull';
 *
 * type User = { id: string; name: string };
 *
 * const findUser = Option.fn((id: string, users: User[]) =>
 *   users.find((user) => user.id === id),
 * );
 *
 * findUser('u1', [{ id: 'u1', name: 'Alice' }]);
 * // { type: 'Some', value: { id: 'u1', name: 'Alice' } }
 * ```
 *
 * @example Asynchronous function
 * ```ts
 * import { Option } from 'byenull';
 *
 * type User = { id: string; name: string };
 *
 * const fetchUser = Option.fn(async (id: string) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json() as Promise<User>;
 * });
 *
 * await fetchUser('u1');
 * // { type: 'Some', value: { id: 'u1', name: 'Alice' } }
 * ```
 *
 * @see {@link maybe} - For wrapping a thunk that takes no parameters.
 *
 * @category Creators
 */
export function fn<F extends (...args: readonly any[]) => Promise<any>>(
  fn: F,
): (...args: Parameters<F>) => OptionAsync<NonNullable<Awaited<ReturnType<F>>>>;
export function fn<F extends (...args: readonly any[]) => any>(
  fn: F,
): (...args: Parameters<F>) => Option<NonNullable<ReturnType<F>>>;
export function fn(fn: any) {
  return (...args: any[]) => {
    const output = fn(...args);

    if (isPromise(output)) {
      const promise = output.then((value) => some(value));

      return promise.catch(() => none());
    }

    return some(output);
  };
}
