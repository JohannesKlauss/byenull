import {isPromise} from "../internals/is-promise";
import type {InferSome, Option, OptionFor, OptionMaybeAsync} from "../option";
import {isSome} from "./is-some";

export function orElse<F extends () => OptionMaybeAsync<any>>(fn: F): <O1 extends OptionMaybeAsync<any>>(option: O1) => OptionFor<O1 | ReturnType<F>, InferSome<O1> | InferSome<F>>
export function orElse<O1 extends OptionMaybeAsync<any>, O2 extends OptionMaybeAsync<any>>(fn: () => O2) {
  return (option: O1) => {
    const apply = (o: Option<InferSome<O1>>) => {
      if (isSome(o)) {
        return o
      }

      return fn()
    }

    return isPromise(option) ? option.then(apply) : apply(option)
  }
}