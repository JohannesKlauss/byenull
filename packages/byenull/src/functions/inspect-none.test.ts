import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import type { Option, OptionAsync } from "../option";
import { inspectNone } from "./inspect-none";
import { none } from "./none";
import { some } from "./some";

describe("inspectNone", () => {
  describe("runtime", () => {
    describe.each([
      [
        "synchronous",
        () => {
          console.log("No value present");
        },
        true,
      ],
      [
        "asynchronous",
        async () => {
          await Promise.resolve("No value present");
        },
        false,
      ],
    ])("with a %s side effect", (_, effect, synchronousEffect) => {
      it.each([
        ["synchronous Some", some(2), false, true],
        ["synchronous None", none(), true, true],
        ["asynchronous Some", Promise.resolve(some(2)), false, false],
        ["asynchronous None", Promise.resolve(none()), true, false],
      ])("handles %s input", async (_, input, isNone, synchronousInput) => {
        const sideEffect = vi.fn(effect);
        const result = inspectNone(sideEffect)(input);
        const expected = isNone ? none() : some(2);

        if (synchronousInput && (synchronousEffect || !isNone)) {
          expect(result).toEqual(expected);
        } else {
          expect(result).toBeInstanceOf(Promise);
        }

        expect(await result).toEqual(expected);
        expect(sideEffect).toHaveBeenCalledTimes(isNone ? 1 : 0);
      });
    });
  });

  describe("types", () => {
    const syncEffect = () => {
      console.log("No value present");
    };

    const asyncEffect = async () => {
      await Promise.resolve("No value present");
    };

    describe("when input is None", () => {
      it("should return the input option type unchanged", () => {
        const result = inspectNone(syncEffect)(none());

        expectTypeOf(result).toEqualTypeOf<Option<never>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const result = inspectNone(syncEffect)(Promise.resolve(none()));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<never>>();
      });

      it("should widen to OptionAsync when side effect is asynchronous", () => {
        const result = inspectNone(asyncEffect)(none());

        expectTypeOf(result).toEqualTypeOf<OptionAsync<never>>();
      });

      it("should return input option type when side effect is asynchronous and awaited", async () => {
        const result = await inspectNone(asyncEffect)(none());

        expectTypeOf(result).toEqualTypeOf<Option<never>>();
      });
    });

    describe("when input is Some", () => {
      it("should return the input option type unchanged", () => {
        const result = inspectNone(syncEffect)(some(2));

        expectTypeOf(result).toEqualTypeOf<Option<number>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const result = inspectNone(syncEffect)(Promise.resolve(some(2)));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<number>>();
      });

      it("should widen to OptionAsync when side effect is asynchronous", () => {
        const result = inspectNone(asyncEffect)(some(2));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<number>>();
      });
    });
  });
});
