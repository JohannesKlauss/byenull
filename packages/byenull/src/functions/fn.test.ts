import { describe, expect, it } from "vite-plus/test";
import { fn } from "./fn";
import { none } from "./none";
import { some } from "./some";

describe("fn", () => {
  describe("when function is synchronous", () => {
    it("should wrap non null return type in Some value", () => {
      const computation = fn((x: number) => (x * x).toString());
      const option = computation(2);

      expect(option).toEqual(some("4"));
    });

    it("should wrap null return type in None value", () => {
      const computation = fn(() => null);
      const option = computation();

      expect(option).toEqual(none());
    });

    it("should wrap undefined return type in None value", () => {
      const computation = fn(() => undefined);
      const option = computation();

      expect(option).toEqual(none());
    });

    it("should forward multiple arguments to the wrapped function", () => {
      const computation = fn(
        (id: string, users: Array<{ id: string; name: string }>) =>
          users.find((user) => user.id === id)?.name,
      );
      const option = computation("u2", [
        { id: "u1", name: "Alice" },
        { id: "u2", name: "Bob" },
      ]);

      expect(option).toEqual(some("Bob"));
    });
  });

  describe("when function is asynchronous", () => {
    it("should wrap non null return type in Some value", async () => {
      const computation = fn((x: number) => Promise.resolve((x * x).toString()));
      const option = await computation(2);

      expect(option).toEqual(some("4"));
    });

    it("should wrap null return type in None value", async () => {
      const computation = fn(() => Promise.resolve(null));
      const option = await computation();

      expect(option).toEqual(none());
    });

    it("should wrap undefined return type in None value", async () => {
      const computation = fn(() => undefined);
      const option = computation();

      expect(option).toEqual(none());
    });

    it("should forward multiple arguments to the wrapped async function", async () => {
      const computation = fn(
        async (id: string, users: Array<{ id: string; name: string }>) =>
          users.find((user) => user.id === id)?.name,
      );
      const option = await computation("u3", [
        { id: "u1", name: "Alice" },
        { id: "u2", name: "Bob" },
      ]);

      expect(option).toEqual(none());
    });
  });
});
