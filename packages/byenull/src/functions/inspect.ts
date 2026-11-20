import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isNone } from "./is-none";

/**
 * Executes a side effect function on the value of a {@link Some} in an {@link Option} or {@link OptionAsync},
 * without modifying the original option. This is useful for debugging, logging, or performing
 * other side effects while maintaining the original value.
 *
 * If the input is a {@link None}, the provided function is never called and the option is returned unchanged.
 *
 * @typeParam O - The input {@link Option} or {@link OptionAsync}.
 * @typeParam R - The return type of the inspection function.
 *
 * @example Some Case
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.some(42),
 *   Option.inspect((value) => console.log('Debug:', value)),
 * );
 * // Console output: "Debug: 42"
 * // Option: { type: 'Some', value: 42 }
 * ```
 *
 * @example None Case (fn is never called)
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.pipe(
 *   Option.none(),
 *   Option.inspect((value: number) => console.log('Debug:', value)),
 * );
 * // No console output
 * // Option: { type: 'None' }
 * ```
 *
 * @example Asynchronous Side Effect
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = await Option.pipe(
 *   Option.some(42),
 *   Option.inspect(async (value) => {
 *     await fetch(`/api/logs?value=${value}`);
 *   }),
 * );
 * // { type: 'Some', value: 42 }
 * ```
 *
 * @see {@link inspectNone} - For inspecting a {@link None} instead.
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export function inspect<O extends OptionMaybeAsync<any>, R extends void | Promise<void>>(
  fn: (a: InferSome<O>) => R,
): (option: O) => OptionFor<O | R, InferSome<O>>;
export function inspect<F extends (a: any) => void | Promise<void>>(
  fn: F,
): <O extends OptionMaybeAsync<Parameters<F>[0]>>(
  option: O,
) => OptionFor<O | ReturnType<F>, InferSome<O>>;
export function inspect<O extends OptionMaybeAsync<any>, R extends void | Promise<void>>(
  fn: (a: InferSome<O>) => R,
) {
  return (option: O): OptionFor<O | R, InferSome<O>> => {
    const apply = (
      o: Option<InferSome<O>>,
    ): Option<InferSome<O>> | Promise<Option<InferSome<O>>> => {
      if (isNone(o)) {
        return o;
      }

      const next = fn(o.value);
      if (isPromise(next)) {
        return next.then(() => o);
      }

      return o;
    };

    if (isPromise(option)) {
      return option.then<unknown>(apply) as OptionFor<O | R, InferSome<O>>;
    }

    return apply(option) as OptionFor<O | R, InferSome<O>>;
  };
}
