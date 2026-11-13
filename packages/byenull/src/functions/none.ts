import type { Option } from "../option";

export function none(): Option<never> {
  return {
    type: "None",
  };
}
