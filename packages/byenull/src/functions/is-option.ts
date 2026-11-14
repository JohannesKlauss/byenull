import type { NonNullableValue, Option } from "../option";

/**
 * Checks whether an unknown value is an {@link Option}.
 *
 * A value is an `Option` when it is an object with a `type` property of
 * `"Some"` (with a `value` property) or `"None"`.
 *
 * @typeParam T - The value type of the `Option` to check for.
 *
 * @param option - The value to check.
 *
 * @returns `true` when the value is an `Option`.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * const value: unknown = { type: 'Some', value: 42 };
 *
 * if (Option.isOption<number>(value)) {
 *   // value is Option<number>
 * }
 * ```
 *
 * @category Type Guards
 */
export function isOption<T extends NonNullableValue>(option: unknown): option is Option<T> {
  return (
    typeof option === "object" &&
    option !== null &&
    "type" in option &&
    ((option.type === "Some" && "value" in option) || option.type === "None")
  );
}
