import type { None, Option } from "../option";

/**
 * Type guard to check if an {@link Option} is a {@link None}.
 *
 * @typeParam O - The Option type to check.
 * @param option - The {@link Option} to check.
 * @returns `true` if the option is a {@link None}, otherwise `false`.
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
