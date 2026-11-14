import type { Option } from "../option";
import { none } from "./none";

/**
 * Creates a {@link Some} from a given value.
 * Passing `null` or `undefined` returns {@link None} instead.
 *
 * @typeParam T - The type of the value to wrap.
 * @returns A {@link Some} containing the value, or {@link None} if the value is nullish.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * const some = Option.some(42);
 * // { type: 'Some', value: 42 }
 *
 * const none = Option.some(null);
 * // { type: 'None' }
 * ```
 *
 * @category Creators
 */
export function some<T>(value: T): Option<NonNullable<T>> {
  if (value === null || typeof value === "undefined") {
    return none();
  }

  return {
    type: "Some",
    value,
  };
}
