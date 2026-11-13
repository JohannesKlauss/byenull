import type { NonNullableValue, Option } from "../option";

export function isOption<T extends NonNullableValue>(option: unknown): option is Option<T> {
  return (
    typeof option === "object" &&
    option !== null &&
    "type" in option &&
    ((option.type === "Some" && "value" in option) || option.type === "None")
  );
}
