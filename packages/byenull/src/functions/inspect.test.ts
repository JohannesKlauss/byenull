import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import type { Option, OptionAsync } from "../option";
import { inspect } from "./inspect";
import { none } from "./none";
import { some } from "./some";

describe("inspect", () => {
  describe("runtime", () => {
    describe.each([
      [
        "synchronous",
        (value: number) => {
          console.log(value);
        },
        true,
      ],
      [
        "asynchronous",
        async (value: number) => {
          await Promise.resolve(value);
        },
        false,
      ],
    ])("with a %s side effect", (_, effect, synchronousEffect) => {
      it.each([
        ["synchronous Some", some(2), true, true],
        ["synchronous None", none(), false, true],
        ["asynchronous Some", Promise.resolve(some(2)), true, false],
        ["asynchronous None", Promise.resolve(none()), false, false],
      ])("handles %s input", async (_, input, hasValue, synchronousInput) => {
        const sideEffect = vi.fn(effect);
        const result = inspect(sideEffect)(input);
        const expected = hasValue ? some(2) : none();

        if (synchronousInput && (synchronousEffect || !hasValue)) {
          expect(result).toEqual(expected);
        } else {
          expect(result).toBeInstanceOf(Promise);
        }

        expect(await result).toEqual(expected);
        expect(sideEffect).toHaveBeenCalledTimes(hasValue ? 1 : 0);

        if (hasValue) {
          expect(sideEffect).toHaveBeenCalledWith(2);
        }
      });
    });
  });

  describe("types", () => {
    const syncEffect = (value: number) => {
      console.log(value);
    };

    const asyncEffect = async (value: number) => {
      await Promise.resolve(value);
    };

    describe("when input is Some", () => {
      it("should return the input option type unchanged", () => {
        const result = inspect(syncEffect)(some(2));

        expectTypeOf(result).toEqualTypeOf<Option<number>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const result = inspect(syncEffect)(Promise.resolve(some(2)));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<number>>();
      });

      it("should widen to OptionAsync when side effect is asynchronous", () => {
        const result = inspect(asyncEffect)(some(2));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<number>>();
      });

      it("should return input option type when side effect is asynchronous and awaited", async () => {
        const result = await inspect(asyncEffect)(some(2));

        expectTypeOf(result).toEqualTypeOf<Option<number>>();
      });
    });

    describe("when input is None", () => {
      it("should return the input option type unchanged", () => {
        const result = inspect(syncEffect)(none());

        expectTypeOf(result).toEqualTypeOf<Option<never>>();
      });

      it("should widen to OptionAsync when input is Promise", () => {
        const result = inspect(syncEffect)(Promise.resolve(none()));

        expectTypeOf(result).toEqualTypeOf<OptionAsync<never>>();
      });

      it("should widen to OptionAsync when side effect is asynchronous", () => {
        const result = inspect(asyncEffect)(none());

        expectTypeOf(result).toEqualTypeOf<OptionAsync<never>>();
      });
    });
  });
});
