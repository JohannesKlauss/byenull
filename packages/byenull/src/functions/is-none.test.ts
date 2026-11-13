import { describe, expect, it } from "vite-plus/test";
import { isNone } from "./is-none";
import { none } from "./none";
import { some } from "./some";

describe("isNone", () => {
  it("should return true for a None value", () => {
    const option = none();

    expect(isNone(option)).toBe(true);
  });

  it("should return false for a Some value", () => {
    const option = some("value");

    expect(isNone(option)).toBe(false);
  });
});
