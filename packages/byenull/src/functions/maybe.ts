import { isPromise } from "../internals/is-promise";
import type { Option, OptionAsync } from "../option";
import { none } from "./none";
import { some } from "./some";

/**
 * Executes a function and wraps its result in an {@link Option} or {@link OptionAsync}.
 *
 * Nullish values and Promise rejections produce {@link None}; synchronous throws are not captured.
 *
 * @typeParam F - The function type to execute.
 * @returns An {@link Option} or {@link OptionAsync} wrapping the function's return value.
 *
 * @example Synchronous Thunk
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.maybe(() => document.querySelector('#app'));
 * // { type: 'Some', value: HTMLElement } or { type: 'None' }
 * ```
 *
 * @example Asynchronous Thunk
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
