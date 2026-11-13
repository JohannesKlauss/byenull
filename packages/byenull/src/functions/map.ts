import { isPromise } from "../internals/is-promise";
import type { NonNullableValue, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isNone } from "./is-none";
import { some } from "./some";

export function map<T extends NonNullableValue, U extends NonNullableValue>(fn: (a: T) => U) {
  return <O extends OptionMaybeAsync<T>>(option: O): OptionFor<O, U> => {
    const apply = (o: Option<T>) => {
      if (isNone(o)) {
        return o;
      }

      return some(fn(o.value));
    };

    if (isPromise(option)) {
      return option.then<unknown>(apply) as OptionFor<O, U>;
    }

    return apply(option) as OptionFor<O, U>;
  };
}
