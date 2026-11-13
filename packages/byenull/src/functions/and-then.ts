import { isPromise } from "../internals/is-promise";
import type { InferSome, Option, OptionFor, OptionMaybeAsync } from "../option";
import { isNone } from "./is-none";

export function andThen<O1 extends OptionMaybeAsync<any>, O2 extends OptionMaybeAsync<any>>(
  fn: (a: InferSome<O1>) => O2,
): (option: O1) => OptionFor<O1 | O2, InferSome<O2>>;
export function andThen<F extends (a: any) => OptionMaybeAsync<any>>(
  fn: F,
): <O1 extends OptionMaybeAsync<Parameters<F>[0]>>(
  option: O1,
) => OptionFor<O1 | ReturnType<F>, InferSome<F>>;
export function andThen<O1 extends OptionMaybeAsync<any>, O2 extends OptionMaybeAsync<any>>(
  fn: (a: InferSome<O1>) => O2,
) {
  return (option: O1) => {
    const apply = (o: Option<InferSome<O1>>) => {
      if (isNone(o)) {
        return o;
      }

      return fn(o.value);
    };

    return isPromise(option) ? option.then(apply) : apply(option);
  };
}
