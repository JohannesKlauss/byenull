import { describe, expect, it, vi } from "vite-plus/test";
import type { MatcherState } from "./matcher";
import { O } from "byenull";
import { toBeSome } from "./to-be-some";

const createMatcherState = (state?: Partial<MatcherState>): MatcherState => ({
  isNot: false,
  utils: {
    matcherHint: vi.fn((matcherName: string) => matcherName),
    printReceived: vi.fn((value: unknown) => String(value).toString()),
  },
  ...state,
});

describe("toBeSome", () => {
  describe("when received is a Some", () => {
    const state = createMatcherState();
    const value = O.some(42);

    it("should return pass as true", () => {
      const { pass } = toBeSome.call(state, value);

      expect(pass).toBe(true);
    });

    it("should call callback with the some value", () => {
      const callback = vi.fn();

      toBeSome.call(state, value, callback);

      expect(callback).toHaveBeenCalledWith(42);
    });
  });

  describe("when received is None", () => {
    const state = createMatcherState();
    const value = O.none();

    it("should return pass as false", () => {
      const { pass } = toBeSome.call(state, value);

      expect(pass).toBe(false);
    });

    it("should not call callback", () => {
      const callback = vi.fn();

      toBeSome.call(state, value, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should return a message describing the received value", () => {
      const { message } = toBeSome.call(state, value);

      expect(message()).toContain("Expected value to be Some");
    });
  });

  describe("when received is a string", () => {
    const state = createMatcherState();
    const value = "not a option";

    it("should return pass as false", () => {
      const { pass } = toBeSome.call(state, value);

      expect(pass).toBe(false);
    });

    it("should not call callback", () => {
      const callback = vi.fn();

      toBeSome.call(state, value, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should return a message describing the received value", () => {
      const { message } = toBeSome.call(state, value);

      expect(message()).toContain("Expected value to be Some");
    });
  });

  describe("when isNot is true", () => {
    const state = createMatcherState({ isNot: true });

    describe.each([
      { type: "Some", value: O.some(42) },
      { type: "None", value: O.none() },
      { type: "string", value: "not a result" },
    ])("when received is $type", ({ value }) => {
      it("should return pass as true", () => {
        const { pass } = toBeSome.call(state, value);

        expect(pass).toBe(true);
      });

      it("should not call callback", () => {
        const callback = vi.fn();

        toBeSome.call(state, value, callback);

        expect(callback).not.toHaveBeenCalled();
      });

      it("should return a message suggesting to use toBeNone instead", () => {
        const { message } = toBeSome.call(state, value);

        expect(message()).toBe(
          "Do not use .not with .toBeSome, use .toBeNone to match on None values.",
        );
      });
    });
  });
});
