import type { Option } from "../option";

/**
 * Checks whether an {@link Option} is a {@link Some}.
 *
 * Beyond the boolean result, the returned type predicate narrows the type so
 * that `value` is accessible without a cast.
 *
 * @typeParam O - The `Option` type to check.
 *
 * @param option - The `Option` to check.
 *
 * @returns `true` when the `Option` is a `Some`.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * declare const option: Option.Option<number>;
 *
 * if (Option.isSome(option)) {
 *   console.log(option.value); // number
 * }
 * ```
 *
 * @category Type Guards
 */
export function isSome<O extends Option<unknown>>(
  option: O,
): option is Extract<O, { readonly type: "Some" }> {
  return option.type === "Some";
}
