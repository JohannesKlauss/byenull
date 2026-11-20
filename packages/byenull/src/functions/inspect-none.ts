import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isSome } from "./is-some";

/**
 * Executes a side effect function when an {@link Option} or {@link OptionAsync} is a {@link None},
 * without modifying the original option. This is useful for debugging, logging, or performing
 * other side effects while maintaining the original value.
 *
 * If the input is a {@link Some}, the provided function is never called and the option is returned unchanged.
 *
 * @typeParam F - The side effect function to execute on a {@link None}.
 * @typeParam O - The input {@link Option} or {@link OptionAsync}.
 *
 * @example None Case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.none(),
 *   Option.inspectNone(() => console.log('Debug: No value present')),
 * );
 * // Console output: "Debug: No value present"
 * // Option: { type: 'None' }
 * ```
 *
 * @example Some Case (fn is never called)
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.some(42),
 *   Option.inspectNone(() => console.log('Debug: No value present')),
 * );
 * // No console output
 * // Option: { type: 'Some', value: 42 }
 * ```
 *
 * @example Asynchronous Side Effect
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = await Option.pipe(
 *   Option.none(),
 *   Option.inspectNone(async () => {
 *     await fetch('/api/logs?value=missing');
 *   }),
 * );
 * // { type: 'None' }
 * ```
 *
 * @see {@link inspect} - For inspecting a {@link Some} instead.
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export function inspectNone<F extends () => void | Promise<void>>(
  fn: F,
): <O extends OptionMaybeAsync<any>>(option: O) => OptionFor<O | ReturnType<F>, InferSome<O>>;
export function inspectNone<F extends () => void | Promise<void>>(fn: F) {
  return <O extends OptionMaybeAsync<any>>(
    option: O,
  ): OptionFor<O | ReturnType<F>, InferSome<O>> => {
    const apply = (
      o: Option<InferSome<O>>,
    ): Option<InferSome<O>> | Promise<Option<InferSome<O>>> => {
      if (isSome(o)) {
        return o;
      }

      const next = fn();
      if (isPromise(next)) {
        return next.then(() => o);
      }

      return o;
    };

    if (isPromise(option)) {
      return option.then<unknown>(apply) as OptionFor<O | ReturnType<F>, InferSome<O>>;
    }

    return apply(option) as OptionFor<O | ReturnType<F>, InferSome<O>>;
  };
}
