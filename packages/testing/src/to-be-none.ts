import { O } from "byenull";
import type { MatcherReturnType, MatcherState } from "./matcher";

/**
 * The type of the `toBeNone` matcher, as exposed on `expect`.
 *
 * @typeParam O - The matcher's return type, fixed by the test framework.
 *
 * @category Matchers
 */
export type ToBeNone<O> = () => O;

/**
 * Asserts that the received value is a `None`.
 *
 * Do not combine this matcher with `.not`; use `toBeSome` to match on a
 * `Some` instead.
 *
 * @param received - The value to check.
 *
 * @returns The matcher result consumed by the test framework.
 *
 * @example
 * ```ts
 * import { O } from 'byenull';
 *
 * test('finds no user', () => {
 *   expect(findUser('u404', users)).toBeNone();
 * });
 * ```
 *
 * @category Matchers
 */
export function toBeNone(this: MatcherState, received: unknown): MatcherReturnType {
  const pass = O.isOption(received) && O.isNone(received);

  return {
    pass: this.isNot || pass,
    message: () => {
      return this.isNot
        ? "Do not use .not with .toBeNone, use .toBeSome to match on Some values."
        : "" +
            this.utils.matcherHint(".toBeNone", "received", "") +
            "\n\n" +
            "Expected value to be None, but received:\n" +
            `  ${this.utils.printReceived(received)}`;
    },
  };
}
