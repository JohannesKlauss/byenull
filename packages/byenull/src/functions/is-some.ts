import type { Option } from "../option";

/**
 * Type guard to check if an {@link Option} is a {@link Some}.
 *
 * @typeParam O - The Option type to check.
 * @param option - The {@link Option} to check.
 * @returns `true` if the option is a {@link Some}, otherwise `false`.
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
