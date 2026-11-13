import {R} from "@praha/byethrow";
import {describe, expect, it} from "vite-plus/test";
import {fromResult} from "./from-result";
import {none} from "./none";
import {some} from "./some";
import {toResult} from "./to-result";

describe("toResult", () => {
  it("should transform a synchronous Some value to a succeed Result", () => {
    const option = some(2)
    const result = toResult(option, "failure")

    expect(result).toEqual(R.succeed(2))
  })

  it("should transform a synchronous None value to a failure Result", () => {
    const option = none()
    const result = toResult(option, "failure")

    expect(result).toEqual(R.fail("failure"))
  })

  it("should transform a asynchronous Some value to a succeed Result", async () => {
    const option = Promise.resolve(some(2))
    const result = await toResult(option, "failure")

    expect(result).toEqual(R.succeed(2))
  })

  it("should transform a asynchronous None value to a failure Result", async () => {
    const option = Promise.resolve(none())
    const result = await toResult(option, "failure")

    expect(result).toEqual(R.fail("failure"))
  })

  it("should transform a None value to a given Error", async () => {
    const option = Promise.resolve(none())
    const result = await toResult(option, "failure")

    expect(result).toEqual(R.fail("failure"))
  })
})