import {describe, expect, it} from "vite-plus/test";
import {fn} from "./fn";
import {none} from "./none";
import {some} from "./some";

describe("maybe", () => {
  describe("when function is synchronous", () => {
    it('should wrap non null return type in Some value', () => {
      const computation = fn((x: number) => (x * x).toString())
      const option = computation(2)

      expect(option).toEqual(some("4"))
    });

    it('should wrap null return type in None value', () => {
      const computation = fn((x: number) => null)
      const option = computation(2)

      expect(option).toEqual(none())
    });

    it('should wrap undefined return type in None value', () => {
      const computation = fn((x: number) => undefined)
      const option = computation(2)

      expect(option).toEqual(none())
    });
  })

  describe("when function is asynchronous", () => {
    it('should wrap non null return type in Some value', async () => {
      const computation = fn((x: number) => Promise.resolve((x * x).toString()))
      const option = await computation(2)

      expect(option).toEqual(some("4"))
    });

    it('should wrap null return type in None value', async () => {
      const computation = fn((_: any) => Promise.resolve(null))
      const option = await computation(2)

      expect(option).toEqual(none())
    });

    it('should wrap undefined return type in None value', async () => {
      const computation = fn((_: any) => undefined)
      const option = computation(2)

      expect(option).toEqual(none())
    });
  })
})