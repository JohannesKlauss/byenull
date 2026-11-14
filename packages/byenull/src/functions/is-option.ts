import type { NonNullableValue, Option } from "../option";

/**
 * Type guard to check if a value is an {@link Option}.
 *
 * @typeParam T - The type of the value.
 * @param option - The value to check.
 * @returns `true` if the value is an {@link Option}, otherwise `false`.
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
