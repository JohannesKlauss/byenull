import type { Option } from "../option";
import { none } from "./none";

/**
 * Creates a {@link Some} that holds the given value.
 *
 * Passing `null` or `undefined` returns a {@link None} instead, so an
 * `Option` never holds a nullish value.
 *
 * @typeParam T - The type of the value to hold.
 *
 * @param value - The value to hold.
 *
 * @returns A `Some` holding the value, or a `None` when the value is nullish.
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
