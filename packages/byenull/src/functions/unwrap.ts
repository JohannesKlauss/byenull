import type {HasPromise} from "../internals/has-promise";
import {isPromise} from "../internals/is-promise";
import type {InferSome, Option, OptionMaybeAsync} from "../option";
import {isSome} from "./is-some";

export function unwrap<O1 extends OptionMaybeAsync<any>>(defaultValue: InferSome<O1>): true extends HasPromise<O1> ? (option: O1) => Promise<InferSome<O1>> : (option: O1) => InferSome<O1>
export function unwrap<O1 extends OptionMaybeAsync<any>>(defaultValue: null): true extends HasPromise<O1> ? (option: O1) => Promise<null> : (option: O1) => null
export function unwrap<O1 extends OptionMaybeAsync<any>>(defaultValue?: undefined): true extends HasPromise<O1> ? (option: O1) => Promise<undefined> : (option: O1) => undefined {
  return (option: O1) => {
    const apply = (o: Option<InferSome<O1>>) => {
      if (isSome(o)) {
        return o.value
      }

      return defaultValue
    }

    return isPromise(option) ? option.then(apply) : apply(option)
  }
}
