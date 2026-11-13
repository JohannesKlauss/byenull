import { describe, expect, it, vi } from "vite-plus/test";
import { none } from "./none";
import {orElse} from "./or-else";
import { some } from "./some";

describe("orElse", () => {
  describe("when fallback returns a Some value", () => {
    const fallback = vi.fn(() => some("4"));

    describe("when input is synchronous", () => {
      describe("when input is Some", () => {
        const input = some(2);

        it("should leave input as is", () => {
          const option = orElse(fallback)(input);

          expect(option).toEqual(some(2));
        });

        it("should not call the fallback function", () => {
          orElse(fallback)(input);

          expect(fallback).not.toHaveBeenCalled();
        });
      });

      describe("when input is None", () => {
        const input = none();

        it("should return output of fallback", () => {
          const option = orElse(fallback)(input);

          expect(option).toEqual(some("4"));
        });

        it("should call the fallback function", () => {
          orElse(fallback)(input);

          expect(fallback).toHaveBeenCalled();
        });
      });
    });

    describe("when input is asynchronous", () => {
      describe("when input is Some", () => {
        const input = Promise.resolve(some(2));

        it("should leave input as is", async () => {
          const option = await orElse(fallback)(input);

          expect(option).toEqual(some(2));
        });

        it("should not call the fallback function", async () => {
          await orElse(fallback)(input);

          expect(fallback).not.toHaveBeenCalled();
        });
      });

      describe("when input is None", () => {
        const input = Promise.resolve(none());

        it("should return output of fallback", async () => {
          const option = await orElse(fallback)(input);

          expect(option).toEqual(some("4"));
        });

        it("should call the fallback function", async () => {
          await orElse(fallback)(input);

          expect(fallback).toHaveBeenCalled();
        });
      });
    });
  })

  describe("when fallback returns a None value", () => {
    const fallback = vi.fn(() => none());

    describe("when input is synchronous", () => {
      describe("when input is Some", () => {
        const input = some(2);

        it("should leave input as is", () => {
          const option = orElse(fallback)(input);

          expect(option).toEqual(some(2));
        });

        it("should not call the fallback function", () => {
          orElse(fallback)(input);

          expect(fallback).not.toHaveBeenCalled();
        });
      });

      describe("when input is None", () => {
        const input = none();

        it("should return output of fallback", () => {
          const option = orElse(fallback)(input);

          expect(option).toEqual(none());
        });

        it("should call the fallback function", () => {
          orElse(fallback)(input);

          expect(fallback).toHaveBeenCalled();
        });
      });
    });

    describe("when input is asynchronous", () => {
      describe("when input is Some", () => {
        const input = Promise.resolve(some(2));

        it("should leave input as is", async () => {
          const option = await orElse(fallback)(input);

          expect(option).toEqual(some(2));
        });

        it("should not call the fallback function", async () => {
          await orElse(fallback)(input);

          expect(fallback).not.toHaveBeenCalled();
        });
      });

      describe("when input is None", () => {
        const input = Promise.resolve(none());

        it("should return output of fallback", async () => {
          const option = await orElse(fallback)(input);

          expect(option).toEqual(none());
        });

        it("should call the fallback function", async () => {
          await orElse(fallback)(input);

          expect(fallback).toHaveBeenCalled();
        });
      });
    });
  })
});
