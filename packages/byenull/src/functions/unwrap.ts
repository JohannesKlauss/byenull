import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionMaybeAsync } from "../option";
import { isSome } from "./is-some";

type Unwrapped<O, D, V = InferSome<O>> = O extends Promise<any> ? Promise<Awaited<V | D>> : V | D;

/**
 * Extracts the value of a {@link Some}, or returns a default value for a {@link None}.
 *
 * The default value must be assignable to the `Option`'s value type, or be
 * `null` or `undefined`. When the input is an {@link OptionAsync}, a `Promise`
 * of the value or default is returned.
 *
 * @typeParam D - The type of the default value.
 *
 * @param defaultValue - The value to return for a `None`.
 *
 * @returns A function that takes an `Option` (or `OptionAsync`) and returns
 * its value, or the default value.
 *
 * @example Some case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const value = Option.pipe(
 *   Option.some(2),
 *   Option.unwrap(0),
 * );
 * // 2
 * ```
 *
 * @example None case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const empty: Option.Option<number> = Option.none();
 *
 * const value = Option.pipe(
 *   empty,
 *   Option.unwrap(0),
 * );
 * // 0
 * ```
 *
 * @example Nullish default
 * ```ts
 * import { Option } from 'byenull';
 *
 * const value: number | null = Option.pipe(
 *   Option.some(2),
 *   Option.unwrap(null),
 * );
 * ```
 *
 * @see {@link orElse} - For recovering with a fallback Option instead of a plain value.
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Unwraps
 */
export function unwrap<D>(
  defaultValue: D,
): <O extends OptionMaybeAsync<any>>(
  option: O & ([D] extends [InferSome<O> | null | undefined] ? unknown : never),
) => Unwrapped<O, D>;
export function unwrap(defaultValue: unknown) {
  return (option: OptionMaybeAsync<any>) => {
    const apply = (o: Option<any>) => {
      if (isSome(o)) {
        return o.value;
      }

      return defaultValue;
    };

    return isPromise(option) ? option.then(apply) : apply(option);
  };
}
