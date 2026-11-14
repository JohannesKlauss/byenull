import type { None, Option } from "../option";

/**
 * Checks whether an {@link Option} is a {@link None}.
 *
 * Beyond the boolean result, the returned type predicate narrows the type so
 * that the absence of `value` is known to the compiler.
 *
 * @typeParam O - The `Option` type to check.
 *
 * @param option - The `Option` to check.
 *
 * @returns `true` when the `Option` is a `None`.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * declare const option: Option.Option<number>;
 *
 * if (Option.isNone(option)) {
 *   console.log('No value present');
 * }
 * ```
 *
 * @category Type Guards
 */
export function isNone<O extends Option<unknown>>(option: O): option is Extract<O, None> {
  return option.type === "None";
}
