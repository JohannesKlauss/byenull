import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import type { Option } from "../option";
import { andThen } from "./and-then";
import { map } from "./map";
import { none } from "./none";
import { pipe } from "./pipe";
import { some } from "./some";

describe("pipe", () => {
  it("should return the input value when no functions are provided", () => {
    expect(pipe("test")).toBe("test");
  });

  it("should apply a function", () => {
    const result = pipe(2, (x) => x + 3);

    expect(result).toBe(5);
  });

  it("should support complex types and chaining", () => {
    const result = pipe(
      [1, 2, 3],
      (array) => array.map((n) => n * 2),
      (array) => array.filter((n) => n > 3),
      (array) => array.reduce((accumulator, value) => accumulator + value, 0),
      (sum) => sum.toString(),
    );

    expect(result).toBe("10");
  });

  it("should handle a large number of functions", () => {
    const result = pipe(
      1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
    );

    expect(result).toBe(26);
  });

  describe("with options", () => {
    it("should apply curried option functions from left to right", () => {
      const option = pipe(
        some(2),
        map((x: number) => x + 1),
        map((x: number) => x * 3),
        map((x: number) => `Result: ${x}`),
      );

      expect(option).toEqual(some("Result: 9"));
    });

    it("should short-circuit when a step returns None", () => {
      const option = pipe(
        some(2),
        andThen(() => none() as Option<number>),
        map((x: number) => x * 3),
      );

      expect(option).toEqual(none());
    });

    it("should support asynchronous steps", async () => {
      const option = await pipe(
        some(2),
        andThen((x: number) => Promise.resolve(some(x + 1))),
        map((x: number) => x * 3),
      );

      expect(option).toEqual(some(9));
    });

    it("should infer the option type of the pipeline", () => {
      const option = pipe(
        some(2),
        map((x: number) => x.toString()),
      );

      expectTypeOf(option).toEqualTypeOf<Option<string>>();
    });
  });
});
