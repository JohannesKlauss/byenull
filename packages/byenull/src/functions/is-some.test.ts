import { describe, expect, it } from "vite-plus/test";
import { isSome } from "./is-some";
import { none } from "./none";
import { some } from "./some";

describe("isSome", () => {
  it("should return true for a Some value", () => {
    const option = some("value");

    expect(isSome(option)).toBe(true);
  });

  it("should return false for a None value", () => {
    const option = none();

    expect(isSome(option)).toBe(false);
  });
});
