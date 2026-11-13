import {isPromise} from "../internals/is-promise";
import type {Option, OptionAsync} from "../option";
import {none} from "./none";
import {some} from "./some";

export function fn<F extends (...args: readonly any[]) => Promise<any>>(fn: F): (...args: Parameters<F>) => OptionAsync<NonNullable<Awaited<ReturnType<F>>>>
export function fn<F extends (...args: readonly any[]) => any>(fn: F): (...args: Parameters<F>) => Option<NonNullable<ReturnType<F>>>
export function fn(fn: any) {
  return (...args: any[]) => {
    const output = fn(args)

    if (isPromise(output)) {
      const promise = output.then((value) => some(value))

      return promise.catch(() => none())
    }

    return some(output)
  }
}