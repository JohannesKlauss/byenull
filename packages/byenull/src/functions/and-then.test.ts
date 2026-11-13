import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import type { Option, OptionAsync } from "../option";
import { andThen } from "./and-then";
import { none } from "./none";
import { some } from "./some";

describe("andThen", () => {
  describe("runtime", () => {
    describe.each([
      ["synchronous Some", (x: number) => some((x * x).toString()), some("4"), true],
      ["synchronous None", () => none(), none(), true],
      [
        "asynchronous Some",
        (x: number) => Promise.resolve(some((x * x).toString())),
        some("4"),
        false,
      ],
      ["asynchronous None", () => Promise.resolve(none()), none(), false],
    ])("with a %s transform", (_, fn, transformed, synchronousTransform) => {
      it.each([
        ["synchronous Some", some(2), true, true],
        ["synchronous None", none(), false, true],
        ["asynchronous Some", Promise.resolve(some(2)), true, false],
        ["asynchronous None", Promise.resolve(none()), false, false],
      ])("handles %s input", async (_, input, hasValue, synchronousInput) => {
        const transform = vi.fn(fn);
        const result = andThen(transform)(input);
        const expected = hasValue ? transformed : none();

        if (synchronousTransform && synchronousInput) {
          expect(result).toEqual(expected);
        }

        expect(await result).toEqual(expected);
        expect(transform).toHaveBeenCalledTimes(hasValue ? 1 : 0);

        if (hasValue) {
          expect(transform).toHaveBeenCalledWith(2);
        }
      });
    });
  });

  describe("types", () => {
    describe("when input is None", () => {
      it("should infer andThen return type as result of transform when input is None", () => {
        const transform = () => some("4");
        const result = andThen(transform)(none());

        expectTypeOf(result).toEqualTypeOf<Option<string>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const transform = () => some("4");
        const result = andThen(transform)(Promise.resolve(none()));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string>>();
      });

      it("should infer andThen return promise type as result of transform when input is None and transform is asynchronous", () => {
        const transform = () => Promise.resolve(some("4"));
        const result = andThen(transform)(none());

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string>>();
      });

      it("should infer andThen return type as result of transform when input is None and async transform is awaited", async () => {
        const transform = () => Promise.resolve(some("4"));
        const result = await andThen(transform)(none());

        expectTypeOf(result).toEqualTypeOf<Option<string>>();
      });
    });

    describe("when input is Some", () => {
      it("should union Option type from result of transform and input", () => {
        const transform = () => some("4");
        const result = andThen(transform)(some(2));

        expectTypeOf(result).toEqualTypeOf<Option<string>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const transform = () => some("4");
        const result = andThen(transform)(Promise.resolve(some(2)));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string>>();
      });

      it("should union Option promise type from result of transform and input", () => {
        const transform = () => Promise.resolve(some("4"));
        const result = andThen(transform)(some(2));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<string>>();
      });

      it("should infer andThen return type as result of transform when input is None and async transform is awaited", async () => {
        const transform = () => Promise.resolve(some("4"));
        const result = await andThen(transform)(some(2));

        expectTypeOf(result).toEqualTypeOf<Option<string>>();
      });
    });
  });
});
