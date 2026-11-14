import type { Option } from "../option";

/**
 * Creates a {@link None}: an `Option` that holds no value.
 *
 * @returns A `None`.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * const option = Option.none();
 * // { type: 'None' }
 * ```
 *
 * @category Creators
 */
export function none(): Option<never> {
  return {
    type: "None",
  };
}
