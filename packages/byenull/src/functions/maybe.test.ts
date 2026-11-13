import {describe, expect, it} from "vite-plus/test";
import {maybe} from "./maybe";
import {none} from "./none";
import {some} from "./some";

describe("maybe", () => {
  describe("when function is synchronous", () => {
    it.each([
      ['string', 'Some', some('string')],
      [42, 'Some', some(42)],
      [true, 'Some', some(true)],
      [{value: 'string'}, 'Some', some({value: 'string'})],
      [null, 'None', none()],
      [undefined, 'None', none()],
    ])('should wrap $0 return value in $1', (value, _, expected) => {
      const option = maybe(() => value)

      expect(option).toEqual(expected)
    })
  })

  describe("when function is asynchronous", () => {
    it.each([
      ['string', 'Some', some('string')],
      [42, 'Some', some(42)],
      [true, 'Some', some(true)],
      [{value: 'string'}, 'Some', some({value: 'string'})],
      [null, 'None', none()],
      [undefined, 'None', none()],
    ])('should wrap $0 return value in $1', async (value, _, expected) => {
      const option = await maybe(() => Promise.resolve(value))

      expect(option).toEqual(expected)
    })
  })
})