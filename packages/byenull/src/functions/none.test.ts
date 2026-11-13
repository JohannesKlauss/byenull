import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import type { Option } from "../option";
import { none } from "./none";

describe("none", () => {
  it("should create a None object when called", () => {
    const option = none();

    expect(option).toEqual({
      type: "None",
    });
  });

  it("should return Option<never> when called", () => {
    const option = none();

    type ReturnType = typeof option;

    expectTypeOf<ReturnType>().toEqualTypeOf<Option<never>>();
  });
});
