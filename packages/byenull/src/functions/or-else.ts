import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isSome } from "./is-some";

/**
 * Chains a fallback computation for an {@link Option} or {@link OptionAsync}.
 * If the input is a {@link Some}, it is returned unchanged.
 * Otherwise, the provided function is called, and its result is returned as-is.
 *
 * @typeParam F - The fallback function type.
 *
 * @example None Case
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
 * @example Some Case (fn is never called)
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
