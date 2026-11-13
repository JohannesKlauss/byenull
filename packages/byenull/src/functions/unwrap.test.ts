import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import type { Option, OptionMaybeAsync } from "../option";
import { none } from "./none";
import { some } from "./some";
import { unwrap } from "./unwrap";

describe("unwrap", () => {
  it.each([
    [some(2), 2],
    [none() as Option<number>, 0],
    [Promise.resolve(some(2)), 2],
    [Promise.resolve(none() as Option<number>), 0],
  ])("returns the value or the fallback", async (option, expected) => {
    expect(await unwrap(0)(option)).toBe(expected);
  });

  it("preserves the value and nullish fallback types", () => {
    const option = some(2);
    expectTypeOf(unwrap(0)(option)).toEqualTypeOf<number>();
    expectTypeOf(unwrap(null)(option)).toEqualTypeOf<number | null>();
    expectTypeOf(unwrap(undefined)(option)).toEqualTypeOf<number | undefined>();
    expectTypeOf(unwrap(null)(Promise.resolve(option))).toEqualTypeOf<Promise<number | null>>();
  });

  it.each([null, undefined])("returns a nullish fallback for None", async (fallback) => {
    expect(unwrap(fallback)(none())).toBe(fallback);
    expect(await unwrap(fallback)(Promise.resolve(none()))).toBe(fallback);
    expect(unwrap(fallback)(some(2))).toBe(2);
  });

  it("preserves synchronous and asynchronous results for mixed inputs", () => {
    const option: OptionMaybeAsync<number> =
      Math.random() > 0.5 ? some(2) : Promise.resolve(some(2));
    expectTypeOf(unwrap(null)(option)).toEqualTypeOf<number | null | Promise<number | null>>();
  });
});
