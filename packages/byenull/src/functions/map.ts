import { isPromise } from "../internals/is-promise";
import type { InferSome, NonNullableValue, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isNone } from "./is-none";
import { some } from "./some";

/**
 * Applies a transformation function to the value of an {@link Option} or {@link OptionAsync}.
 * If the input is a {@link None}, it is returned unchanged.
 *
 * @typeParam O - The input {@link Option} or {@link OptionAsync}.
 * @typeParam U - The transformed value type.
 *
 * @example Some Case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.some(2),
 *   Option.map((x) => x * 10),
 * );
 * // { type: 'Some', value: 20 }
 * ```
 *
 * @example None Case (unchanged)
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.none(),
 *   Option.map((x: number) => x * 10),
 * );
 * // { type: 'None' }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export function map<O extends OptionMaybeAsync<any>, const U>(
  fn: (a: InferSome<O>) => U,
): (option: O) => OptionFor<O, U>;
export function map<T extends NonNullableValue, U extends NonNullableValue>(
  fn: (a: T) => U,
): <O2 extends OptionMaybeAsync<T>>(option: O2) => OptionFor<O2, U>;
export function map<T extends NonNullableValue, U extends NonNullableValue>(fn: (a: T) => U) {
  return <O extends OptionMaybeAsync<T>>(option: O): OptionFor<O, U> => {
    const apply = (o: Option<T>) => {
      if (isNone(o)) {
        return o;
      }

      return some(fn(o.value));
    };

    if (isPromise(option)) {
      return option.then<unknown>(apply) as OptionFor<O, U>;
    }

    return apply(option) as OptionFor<O, U>;
  };
}
