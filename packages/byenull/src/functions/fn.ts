import { isPromise } from "../internals/is-promise";
import type { Option, OptionAsync } from "../option";
import { none } from "./none";
import { some } from "./some";

/**
 * Wraps a function and returns a new function that returns an {@link Option} or {@link OptionAsync}.
 *
 * Nullish values and Promise rejections produce {@link None}; synchronous throws are not captured.
 *
 * @typeParam F - The function type to wrap.
 * @returns A new function that returns an {@link Option} or {@link OptionAsync}.
 *
 * @example Synchronous Function
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
 * @example Asynchronous Function
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
