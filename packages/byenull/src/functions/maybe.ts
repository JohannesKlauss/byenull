import {isPromise} from "../internals/is-promise";
import type {Option, OptionAsync} from "../option";
import {none} from "./none";
import {some} from "./some";

export function maybe<F extends () => Promise<any>>(fn: F): OptionAsync<NonNullable<Awaited<ReturnType<F>>>>
export function maybe<F extends () => any>(fn: F): Option<NonNullable<ReturnType<F>>>
export function maybe(fn: any) {
  const output = fn()

  if (isPromise(output)) {
    const promise = output.then((value) => some(value))

    return promise.catch(() => none())
  }

  return some(output)
}