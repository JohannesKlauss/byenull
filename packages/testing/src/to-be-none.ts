import { O } from 'byenull';
import type {MatcherReturnType, MatcherState} from "./matcher";

export type ToBeNone<O, T> = () => O;

export function toBeNone(this: MatcherState, received: unknown): MatcherReturnType {
  const pass = O.isOption(received) && O.isNone(received)

  return {
    pass: this.isNot || pass,
    message: () => {
      return this.isNot
        ? 'Do not use .not with .toBeNone, use .toBeSome to match on Some values.'
        : ''
        + this.utils.matcherHint('.toBeNone', 'received', '')
        + '\n\n'
        + 'Expected value to be None, but received:\n'
        + `  ${this.utils.printReceived(received)}`;
    },
  };
}
