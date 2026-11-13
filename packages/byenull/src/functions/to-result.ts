import { R } from "@praha/byethrow";
import { isPromise } from "../internals/is-promise";
import type { Option, OptionAsync } from "../option";
import { isSome } from "./is-some";

export function toResult<E>(err: E) {
  function convert<T>(option: Option<T>): R.Result<T, E>;
  function convert<T>(option: OptionAsync<T>): R.ResultAsync<T, E>;
  function convert<T>(option: Option<T> | OptionAsync<T>) {
    const apply = (o: Option<T>) => {
      if (isSome(o)) {
        return R.succeed(o.value);
      }

      return R.fail(err);
    };

    return isPromise(option) ? option.then(apply) : apply(option);
  }

  return convert;
}
