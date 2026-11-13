import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionMaybeAsync } from "../option";
import { isSome } from "./is-some";

type Unwrapped<O, D, V = InferSome<O>> = O extends Promise<any> ? Promise<Awaited<V | D>> : V | D;

export function unwrap<D>(
  defaultValue: D,
): <O extends OptionMaybeAsync<any>>(
  option: O & ([D] extends [InferSome<O> | null | undefined] ? unknown : never),
) => Unwrapped<O, D>;
export function unwrap(defaultValue: unknown) {
  return (option: OptionMaybeAsync<any>) => {
    const apply = (o: Option<any>) => {
      if (isSome(o)) {
        return o.value;
      }

      return defaultValue;
    };

    return isPromise(option) ? option.then(apply) : apply(option);
  };
}
