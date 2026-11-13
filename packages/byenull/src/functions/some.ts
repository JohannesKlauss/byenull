import type { Option } from "../option";
import { none } from "./none";

export function some<T>(value: T): Option<T> {
  if (value === null || typeof value === "undefined") {
    return none();
  }

  return {
    type: "Some",
    value,
  };
}
