import { describe, expect, it, vi } from "vite-plus/test";
import { map } from "./map";
import { none } from "./none";
import { some } from "./some";

describe("map", () => {
  const transform = vi.fn((x: number) => (x * x).toString());

  describe("when input is synchronous", () => {
    describe("when input is Some", () => {
      const input = some(2);

      it("should apply the function to the input", () => {
        const option = map(transform)(input);

        expect(option).toEqual(some("4"));
      });

      it("should call the transform function", () => {
        map(transform)(input);

        expect(transform).toHaveBeenCalled();
      });
    });

    describe("when input is None", () => {
      const input = none();

      it("should apply the function to the input", () => {
        const option = map(transform)(input);

        expect(option).toEqual(none());
      });

      it("should not call the transform function", () => {
        map(transform)(input);

        expect(transform).not.toHaveBeenCalled();
      });
    });
  });

  describe("when input is asynchronous", () => {
    describe("when input is Some", () => {
      const input = Promise.resolve(some(2));

      it("should apply the function to the input", async () => {
        const option = await map(transform)(input);

        expect(option).toEqual(some("4"));
      });

      it("should call the transform function", async () => {
        await map(transform)(input);

        expect(transform).toHaveBeenCalled();
      });
    });

    describe("when input is None", () => {
      const input = Promise.resolve(none());

      it("should apply the function to the input", async () => {
        const option = await map(transform)(input);

        expect(option).toEqual(none());
      });

      it("should not call the transform function", async () => {
        await map(transform)(input);

        expect(transform).not.toHaveBeenCalled();
      });
    });
  });
});
