import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isNone } from "./is-none";

/**
 * Chains the next computation using the value of an {@link Option} or {@link OptionAsync}.
 * If the input is a {@link None}, it is returned unchanged.
 * Otherwise, the provided function is called, and its result is returned as-is.
 *
 * @typeParam F - The function type to chain.
 *
 * @example Some Case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.some(2),
 *   Option.andThen((x) => Option.some(x * 2)),
 * );
 * // { type: 'Some', value: 4 }
 * ```
 *
 * @example None Case (fn is never called)
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.none(),
 *   Option.andThen((x: number) => Option.some(x * 2)),
 * );
 * // { type: 'None' }
 * ```
 *
 * @example Asynchronous Case
 * ```ts
 * import { Option } from 'byenull';
 *
 * type User = { id: string; name: string };
 *
 * const fetchUser = Option.fn(async (id: string) =>
 *   fetch(`/api/users/${id}`).then((response) => response.json() as Promise<User>),
 * );
 *
 * const option = await Option.pipe(
 *   Option.some('u123'),
 *   Option.andThen(fetchUser),
 * );
 * // { type: 'Some', value: User }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export function andThen<F extends (a: any) => OptionMaybeAsync<any>>(
  fn: F,
): <O1 extends OptionMaybeAsync<any>>(option: O1) => OptionFor<O1 | ReturnType<F>, InferSome<F>>;
export function andThen<O1 extends OptionMaybeAsync<any>, O2 extends OptionMaybeAsync<any>>(
  fn: (a: InferSome<O1>) => O2,
): (option: O1) => OptionFor<O1 | O2, InferSome<O2>>;
export function andThen<O1 extends OptionMaybeAsync<any>, O2 extends OptionMaybeAsync<any>>(
  fn: (a: InferSome<O1>) => O2,
) {
  return (option: O1) => {
    const apply = (o: Option<InferSome<O1>>) => {
      if (isNone(o)) {
        return o;
      }

      return fn(o.value);
    };

    return isPromise(option) ? option.then(apply) : apply(option);
  };
}
