import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import type { Option, OptionAsync } from "../option";
import { none } from "./none";
import { orElse } from "./or-else";
import { some } from "./some";

describe("orElse", () => {
  describe("runtime", () => {
    describe.each([
      ["synchronous Some", () => some("4"), some("4"), true],
      ["synchronous None", () => none(), none(), true],
      ["asynchronous Some", () => Promise.resolve(some("4")), some("4"), false],
      ["asynchronous None", () => Promise.resolve(none()), none(), false],
    ])("with a %s fallback", (_, fn, fallbackResult, synchronousFallback) => {
      it.each([
        ["synchronous Some", some(2), true, true],
        ["synchronous None", none(), false, true],
        ["asynchronous Some", Promise.resolve(some(2)), true, false],
        ["asynchronous None", Promise.resolve(none()), false, false],
      ])("handles %s input", async (_, input, hasValue, synchronousInput) => {
        const fallback = vi.fn(fn);
        const result = orElse(fallback)(input);
        const expected = hasValue ? some(2) : fallbackResult;

        if (synchronousFallback && synchronousInput) {
          expect(result).toEqual(expected);
        }
        expect(await result).toEqual(expected);
        expect(fallback).toHaveBeenCalledTimes(hasValue ? 0 : 1);
      });
    });
  });

  describe("types", () => {
    describe("when input is None", () => {
      it("should infer orElse return type as result of fallback when input is None", () => {
        const fallback = () => some("4");
        const result = orElse(fallback)(none());

        expectTypeOf(result).toEqualTypeOf<Option<string>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const fallback = () => some("4");
        const result = orElse(fallback)(Promise.resolve(none()));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string>>();
      });

      it("should infer orElse return promise type as result of fallback when input is None and fallback is asynchronous", () => {
        const fallback = () => Promise.resolve(some("4"));
        const result = orElse(fallback)(none());

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string>>();
      });

      it("should infer orElse return type as result of fallback when input is None and async fallback is awaited", async () => {
        const fallback = () => Promise.resolve(some("4"));
        const result = await orElse(fallback)(none());

        expectTypeOf(result).toEqualTypeOf<Option<string>>();
      });
    });

    describe("when input is Some", () => {
      it("should union Option type from result of fallback and input", () => {
        const fallback = () => some("4");
        const result = orElse(fallback)(some(2));

        expectTypeOf(result).toEqualTypeOf<Option<number | string>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const fallback = () => some("4");
        const result = orElse(fallback)(Promise.resolve(some(2)));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string | number>>();
      });

      it("should union Option promise type from result of fallback and input", () => {
        const fallback = () => Promise.resolve(some("4"));
        const result = orElse(fallback)(some(2));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string | number>>();
      });

      it("should infer orElse return type as result of fallback when input is None and async fallback is awaited", async () => {
        const fallback = () => Promise.resolve(some("4"));
        const result = await orElse(fallback)(some(2));

        expectTypeOf(result).toEqualTypeOf<Option<string | number>>();
      });
    });
  });
});
