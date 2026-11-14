import { R } from "@praha/byethrow";
import { isPromise } from "../internals/is-promise";
import type { Option, OptionAsync } from "../option";
import { none } from "./none";
import { some } from "./some";

/**
 * Converts a Result from
 * {@link https://github.com/praha-inc/byethrow | @praha/byethrow} into an
 * {@link Option} or {@link OptionAsync}.
 * A `Success` becomes a {@link Some}; a `Failure` becomes a {@link None}, discarding the error.
 *
 * @typeParam T - The success value type.
 *
 * @example Success Case
 * ```ts
 * import { Option } from 'byenull';
 * import { Result } from '@praha/byethrow';
 *
 * const option = Option.fromResult(Result.succeed(2));
 * // { type: 'Some', value: 2 }
 * ```
 *
 * @example Failure Case
 * ```ts
 * import { Option } from 'byenull';
 * import { Result } from '@praha/byethrow';
 *
 * const option = Option.fromResult(Result.fail(new Error('Something went wrong')));
 * // { type: 'None' }
 * ```
 *
 * @see {@link toResult} - For the opposite direction.
 *
 * @category Interop
 */
export function fromResult<T>(result: R.Result<T, any>): Option<T>;
export function fromResult<T>(result: R.ResultAsync<T, any>): OptionAsync<T>;
export function fromResult<T>(result: any) {
  const apply = (r: R.Result<T, any>) => {
    if (R.isSuccess(r)) {
      return some(r.value);
    }

    return none();
  };

  return isPromise(result) ? result.then(apply) : apply(result);
}
