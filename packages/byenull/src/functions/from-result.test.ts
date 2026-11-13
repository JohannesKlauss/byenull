import {R} from "@praha/byethrow";
import {describe, expect, it} from "vite-plus/test";
import {fromResult} from "./from-result";
import {none} from "./none";
import {some} from "./some";

describe("fromResult", () => {
  it("should transform a synchronous success to Some", () => {
    const result = R.succeed(2)
    const option = fromResult(result)

    expect(option).toEqual(some(2))
  })

  it("should transform a synchronous failure to None", () => {
    const result = R.fail('sone error')
    const option = fromResult(result)

    expect(option).toEqual(none())
  })

  it("should transform a asynchronous success to Some", async () => {
    const result = Promise.resolve(R.succeed(2))
    const option = await fromResult(result)

    expect(option).toEqual(some(2))
  })

  it("should transform a asynchronous failure to None", async () => {
    const result = Promise.resolve(R.fail('sone error'))
    const option = await fromResult(result)

    expect(option).toEqual(none())
  })
})