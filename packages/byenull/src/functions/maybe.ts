import { isPromise } from "../internals/is-promise";
import type { Option, OptionAsync } from "../option";
import { none } from "./none";
import { some } from "./some";

/**
 * Runs a thunk and wraps its result in an {@link Option}.
 *
 * Returns a {@link Some} of the thunk's return value, or a {@link None} when
 * it returns `null` or `undefined`. When it returns a `Promise`, the result
 * is an {@link OptionAsync}: the promise resolves to a `Some` of the resolved
 * value, or to a `None` when it rejects or resolves with a nullish value. A
 * synchronous throw is not captured and propagates to the caller.
 *
 * @typeParam F - The type of the thunk to run.
 *
 * @param fn - The thunk to run.
 *
 * @returns An `Option` of the thunk's result, or an `OptionAsync` when the
 * thunk is asynchronous.
 *
 * @example Synchronous thunk
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.maybe(() => document.querySelector('#app'));
 * // { type: 'Some', value: HTMLElement } or { type: 'None' }
 * ```
 *
 * @example Asynchronous thunk
 * ```ts
 * import { Option } from 'byenull';
 *
 * type Config = { host: string };
 *
 * const option = await Option.maybe(() =>
 *   fetch('/api/config').then((response) => response.json() as Promise<Config>),
 * );
 * // { type: 'Some', value: Config }
 * ```
 *
 * @see {@link fn} - For wrapping functions that take parameters.
 *
 * @category Creators
 */
export function maybe<F extends () => Promise<any>>(
  fn: F,
): OptionAsync<NonNullable<Awaited<ReturnType<F>>>>;
export function maybe<F extends () => any>(fn: F): Option<NonNullable<ReturnType<F>>>;
export function maybe(fn: any) {
  const output = fn();

  if (isPromise(output)) {
    const promise = output.then((value) => some(value));

    return promise.catch(() => none());
  }

  return some(output);
}
