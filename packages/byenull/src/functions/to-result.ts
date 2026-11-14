import { R } from "@praha/byethrow";
import { isPromise } from "../internals/is-promise";
import type { Option, OptionAsync } from "../option";
import { isSome } from "./is-some";

/**
 * Converts an {@link Option} or {@link OptionAsync} into a Result from
 * {@link https://github.com/praha-inc/byethrow | @praha/byethrow}.
 * A {@link Some} becomes a `Success`; a {@link None} becomes a `Failure` containing `err`.
 *
 * @typeParam E - The error type for a `Failure`.
 *
 * @example Some Case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const result = Option.pipe(
 *   Option.some(2),
 *   Option.toResult(new Error('No value')),
 * );
 * // { type: 'Success', value: 2 }
 * ```
 *
 * @example None Case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const result = Option.pipe(
 *   Option.none(),
 *   Option.toResult(new Error('No value')),
 * );
 * // { type: 'Failure', error: Error('No value') }
 * ```
 *
 * @see {@link fromResult} - For the opposite direction.
 *
 * @category Interop
 */
export function toResult<E>(err: E) {
  // The Option overload must come last: TypeScript uses the final overload
  // when contextually typing the returned function, e.g. inside `pipe`.
  function convert<T>(option: OptionAsync<T>): R.ResultAsync<T, E>;
  function convert<T>(option: Option<T>): R.Result<T, E>;
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
