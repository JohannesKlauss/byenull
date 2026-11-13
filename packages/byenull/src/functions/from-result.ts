import {R} from "@praha/byethrow";
import {isPromise} from "../internals/is-promise";
import type {Option, OptionAsync} from "../option";
import {none} from "./none";
import {some} from "./some";

export function fromResult<T>(result: R.Result<T, any>): Option<T>
export function fromResult<T>(result: R.ResultAsync<T, any>): OptionAsync<T>
export function fromResult<T>(result: any) {
  const apply = (r: R.Result<T, any>) => {
    if (R.isSuccess(r)) {
      return some(r.value)
    }

    return none()
  }

  return isPromise(result) ? result.then(apply) : apply(result)
}