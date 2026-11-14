import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isSome } from "./is-some";

/**
 * Recovers from a {@link None} by calling a fallback thunk.
 * If the input is a {@link Some}, it is returned unchanged and `fn` is never called.
 *
 * When either the input or the output of `fn` is an {@link OptionAsync}, the
 * recovery is asynchronous and an `OptionAsync` is returned.
 *
 * @typeParam F - The type of the fallback thunk.
 *
 * @param fn - A thunk that returns the fallback `Option` (or `OptionAsync`).
 *
 * @returns A function that takes an `Option` (or `OptionAsync`) and returns
 * the original `Some` or the fallback `Option` in the resulting synchronicity.
 *
 * @example None case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.none(),
 *   Option.orElse(() => Option.some('default')),
 * );
 * // { type: 'Some', value: 'default' }
 * ```
 *
 * @example Some case (fn is never called)
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.some('value'),
 *   Option.orElse(() => Option.some('default')),
 * );
 * // { type: 'Some', value: 'value' }
 * ```
 *
 * @see {@link unwrap} - For returning a plain value instead of a fallback Option.
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export function orElse<F extends () => OptionMaybeAsync<any>>(
  fn: F,
): <O1 extends OptionMaybeAsync<any>>(
  option: O1,
) => OptionFor<O1 | ReturnType<F>, InferSome<O1> | InferSome<F>>;
export function orElse<O1 extends OptionMaybeAsync<any>, O2 extends OptionMaybeAsync<any>>(
  fn: () => O2,
) {
  return (option: O1) => {
    const apply = (o: Option<InferSome<O1>>) => {
      if (isSome(o)) {
        return o;
      }

      return fn();
    };

    return isPromise(option) ? option.then(apply) : apply(option);
  };
}
