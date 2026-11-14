import { O } from "byenull";
import type { MatcherReturnType, MatcherState } from "./matcher";

/**
 * The type of the `toBeSome` matcher, as exposed on `expect`.
 *
 * Accepts an optional callback that receives the value of the `Some` when
 * the match passes.
 *
 * @typeParam O - The matcher's return type, fixed by the test framework.
 * @typeParam T - The received value type, used to infer the `Some` value type.
 *
 * @category Matchers
 */
export type ToBeSome<O, T> = (
  callback?: (value: [O.InferSome<T>] extends [never] ? unknown : O.InferSome<T>) => void,
) => O;

/**
 * Asserts that the received value is a `Some`.
 *
 * When the match passes, the optional callback is called with the value of
 * the `Some` — the type of the callback parameter is inferred from the
 * received `Option`.
 *
 * Do not combine this matcher with `.not`; use `toBeNone` to match on a
 * `None` instead.
 *
 * @param received - The value to check.
 * @param callback - An optional assertion callback for the `Some` value.
 *
 * @returns The matcher result consumed by the test framework.
 *
 * @example
 * ```ts
 * import { O } from 'byenull';
 *
 * test('finds the user', () => {
 *   expect(findUser('u1', users)).toBeSome((user) => {
 *     expect(user.name).toBe('Alice');
 *   });
 * });
 * ```
 *
 * @category Matchers
 */
export function toBeSome(
  this: MatcherState,
  received: unknown,
  callback?: (value: unknown) => void,
): MatcherReturnType {
  const pass = O.isOption(received) && O.isSome(received);

  if (!this.isNot && pass && callback) {
    callback(received.value);
  }

  return {
    pass: this.isNot || pass,
    message: () => {
      return this.isNot
        ? "Do not use .not with .toBeSome, use .toBeNone to match on None values."
        : "" +
            this.utils.matcherHint(".toBeSome", "received", "") +
            "\n\n" +
            "Expected value to be Some, but received:\n" +
            `  ${this.utils.printReceived(received)}`;
    },
  };
}
