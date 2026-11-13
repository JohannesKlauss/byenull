import { describe, expect, it, vi } from "vite-plus/test";
import {andThen} from "./and-then";
import { none } from "./none";
import { some } from "./some";

describe("andThen", () => {
  describe("when transform is synchronous", () => {
    describe("and returns a Some value", () => {
      const transform = vi.fn((x: number) => some((x * x).toString()));

      describe("when input is synchronous", () => {
        describe("when input is Some", () => {
          const input = some(2);

          it("should apply the function to the input", () => {
            const option = andThen(transform)(input);

            expect(option).toEqual(some("4"));
          });

          it("should call the transform function", () => {
            andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = none();

          it("should apply the function to the input", () => {
            const option = andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", () => {
            andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });

      describe("when input is asynchronous", () => {
        describe("when input is Some", () => {
          const input = Promise.resolve(some(2));

          it("should apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(some("4"));
          });

          it("should call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = Promise.resolve(none());

          it("should apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });
    })

    describe("and returns a None value", () => {
      const transform = vi.fn((_: number) => none());

      describe("when input is synchronous", () => {
        describe("when input is Some", () => {
          const input = some(2);

          it("should apply the function to the input", () => {
            const option = andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should call the transform function", () => {
            andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = none();

          it("should not apply the function to the input", () => {
            const option = andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", () => {
            andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });

      describe("when input is asynchronous", () => {
        describe("when input is Some", () => {
          const input = Promise.resolve(some(2));

          it("should not apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = Promise.resolve(none());

          it("should not apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });
    })
  })

  describe("when transform is asynchronous", () => {
    describe("and returns a Some value", () => {
      const transform = vi.fn((x: number) => Promise.resolve(some((x * x).toString())));

      describe("when input is synchronous", () => {
        describe("when input is Some", () => {
          const input = some(2);

          it("should apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(some("4"));
          });

          it("should call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = none();

          it("should apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });

      describe("when input is asynchronous", () => {
        describe("when input is Some", () => {
          const input = Promise.resolve(some(2));

          it("should apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(some("4"));
          });

          it("should call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = Promise.resolve(none());

          it("should apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });
    })

    describe("and returns a None value", () => {
      const transform = vi.fn((_: number) => Promise.resolve(none()));

      describe("when input is synchronous", () => {
        describe("when input is Some", () => {
          const input = some(2);

          it("should apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = none();

          it("should not apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });

      describe("when input is asynchronous", () => {
        describe("when input is Some", () => {
          const input = Promise.resolve(some(2));

          it("should not apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).toHaveBeenCalled();
          });
        });

        describe("when input is None", () => {
          const input = Promise.resolve(none());

          it("should not apply the function to the input", async () => {
            const option = await andThen(transform)(input);

            expect(option).toEqual(none());
          });

          it("should not call the transform function", async () => {
            await andThen(transform)(input);

            expect(transform).not.toHaveBeenCalled();
          });
        });
      });
    })
  })
});
