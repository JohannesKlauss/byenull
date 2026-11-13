import type { None, Option } from "../option";

export function isNone<O extends Option<unknown>>(option: O): option is Extract<O, None> {
  return option.type === "None";
}
