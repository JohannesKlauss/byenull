import { describe, expect, it } from "vite-plus/test";
import { isOption } from "./is-option";
import { none } from "./none";
import { some } from "./some";

describe("isOption", () => {
  it.each([
    ["Some", some("value"), true],
    ["Some with null", some(null), true],
    ["Some with undefined", some(undefined), true],
    ["None", none(), true],
  ])("should return $2 for $0", (_, value, expected) => {
    expect(isOption(value)).toBe(expected);
  });

  it.each([
    ["null", null, false],
    ["undefined", undefined, false],
    ["string", "string", false],
    ["number", 42, false],
    ["boolean", true, false],
    ["objects without type property", {}, false],
    ["objects without type property", { value: "test" }, false],
    ["objects with invalid type property", { type: "Success" }, false],
    ["objects with invalid type property", { type: "Error" }, false],
    ["objects with invalid type property", { type: 123 }, false],
    ["objects with invalid type property", { type: true }, false],
    ["Some objects without value", { type: "Some" }, false],
  ])("should return $2 for $0", (_, value, expected) => {
    expect(isOption(value)).toBe(expected);
  });
});
