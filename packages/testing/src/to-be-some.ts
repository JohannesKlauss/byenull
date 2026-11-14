import { O } from 'byenull';
import type {MatcherReturnType, MatcherState} from "./matcher";

export type ToBeSome<O, T> = (callback?: (value: [O.InferSome<T>] extends [never] ? unknown : O.InferSome<T>) => void) => O;

export function toBeSome(this: MatcherState, received: unknown, callback?: (value: unknown) => void): MatcherReturnType {
  const pass = O.isOption(received) && O.isSome(received)

  if (!this.isNot && pass && callback) {
    callback(received.value)
  }

  return {
    pass: this.isNot || pass,
    message: () => {
      return this.isNot
        ? 'Do not use .not with .toBeSome, use .toBeNone to match on None values.'
        : ''
        + this.utils.matcherHint('.toBeSome', 'received', '')
        + '\n\n'
        + 'Expected value to be Some, but received:\n'
        + `  ${this.utils.printReceived(received)}`;
    },
  };
}
