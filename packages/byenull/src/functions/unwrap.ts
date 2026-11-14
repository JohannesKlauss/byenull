import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionMaybeAsync } from "../option";
import { isSome } from "./is-some";

type Unwrapped<O, D, V = InferSome<O>> = O extends Promise<any> ? Promise<Awaited<V | D>> : V | D;

/**
 * Extracts the value from an {@link Option} or {@link OptionAsync}.
 * If the input is a {@link None}, the default value is returned.
 *
 * @typeParam D - The default value type.
 *
 * @example Some Case
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
 * @example None Case
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
 * @example Nullish Default
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
