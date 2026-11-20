import { R } from "@praha/byethrow";
import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import { none } from "./none";
import { pipe } from "./pipe";
import { some } from "./some";
import { toResult } from "./to-result";

describe("toResult", () => {
  it("should transform a synchronous Some value to a succeed Result", () => {
    const option = some(2);
    const result = toResult("failure")(option);

    expect(result).toEqual(R.succeed(2));
  });

  it("should transform a synchronous None value to a failure Result", () => {
    const option = none();
    const result = toResult("failure")(option);

    expect(result).toEqual(R.fail("failure"));
  });

  it("should transform a asynchronous Some value to a succeed Result", async () => {
    const option = Promise.resolve(some(2));
    const result = await toResult("failure")(option);

    expect(result).toEqual(R.succeed(2));
  });

  it("should transform a asynchronous None value to a failure Result", async () => {
    const option = Promise.resolve(none());
    const result = await toResult("failure")(option);

    expect(result).toEqual(R.fail("failure"));
  });

  it("should preserve a function as the error value", () => {
    const error = () => "failure";
    const result = toResult(error)(none());

    expect(result).toEqual(R.fail(error));
  });

  it("should transform a None to a failure with Error", () => {
    const error = new Error("custom error");

    const result = toResult(error)(none());

    expect(result).toEqual(R.fail(error));
  });

  it("should infer synchronous and asynchronous result types", () => {
    const convert = toResult("failure");
    const sync = convert(some(2));
    const async = convert(Promise.resolve(some(2)));

    expectTypeOf(sync).toEqualTypeOf<R.Result<number, string>>();
    expectTypeOf(async).toEqualTypeOf<R.ResultAsync<number, string>>();
  });

  it("should infer the result type when used inside a pipe", () => {
    const piped = pipe(some(2), toResult("failure"));
    const pipedAsync = pipe(Promise.resolve(some(2)), toResult("failure"));

    expectTypeOf(piped).toEqualTypeOf<R.Result<number, string>>();
    expectTypeOf(pipedAsync).toEqualTypeOf<R.ResultAsync<number, string>>();
  });
});
