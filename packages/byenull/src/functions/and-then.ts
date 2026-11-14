import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isNone } from "./is-none";

/**
 * Chains the next computation using the value of a {@link Some}.
 * If the input is a {@link None}, it is returned unchanged and `fn` is never called.
 *
 * When either the input or the output of `fn` is an {@link OptionAsync}, the
 * chain is asynchronous and an `OptionAsync` is returned.
 *
 * @typeParam F - The type of the function to chain.
 *
 * @param fn - A function that receives the value of a `Some` and returns an
 * `Option` (or `OptionAsync`).
 *
 * @returns A function that takes an `Option` (or `OptionAsync`) and returns
 * the chained `Option` in the resulting synchronicity.
 *
 * @example Some case
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
 * @example None case (fn is never called)
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
 * @example Asynchronous case
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
