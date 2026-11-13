import { describe, expect, it } from "vite-plus/test";
import { some } from "./some";

describe("some", () => {
  it("should create a Some object with the provided value", () => {
    const value = { id: "123", name: "test" };
    const option = some(value);

    expect(option).toEqual({
      type: "Some",
      value,
    });
  });

  it("should return a Some object when a Promise is passed", () => {
    const option = some(Promise.resolve(42));

    expect(option).toEqual({
      type: "Some",
      value: Promise.resolve(42),
    });
  });

  it("should create a None object when null is passed", () => {
    const option = some(null);

    expect(option).toEqual({
      type: "None",
    });
  });

  it("should create a None object when undefined is passed", () => {
    const option = some(undefined);

    expect(option).toEqual({
      type: "None",
    });
  });
});
