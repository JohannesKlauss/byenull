import type { Option } from "../option";

export function isSome<O extends Option<unknown>>(
  option: O,
): option is Extract<O, { readonly type: "Some" }> {
  return option.type === "Some";
}
