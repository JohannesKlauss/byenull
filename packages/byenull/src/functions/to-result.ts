import {R} from "@praha/byethrow";
import {isPromise} from "../internals/is-promise";
import type {Option, OptionAsync} from "../option";
import {isSome} from "./is-some";

export function toResult<T, E>(option: Option<T>, err: E): R.Result<T, E>
export function toResult<T, E>(option: OptionAsync<T>, err: E): R.ResultAsync<T, E>
export function toResult<T>(option: any, err: any) {
  const apply = (o: Option<T>) => {
    if (isSome(o)) {
      return R.succeed(o.value)
    }

    return R.fail(err)
  }

  return isPromise(option) ? option.then(apply) : apply(option)
}