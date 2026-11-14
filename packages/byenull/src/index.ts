/**
 * Re-exports core Option-handling utilities under two convenient namespaces:
 *
 * - `Option`: Verbose and explicit usage
 * - `O`: Shorthand alias for more concise code
 *
 * @example Basic Usage
 * ```ts
 * import { Option } from 'byenull';
 *
 * const findUser = Option.fn((id: string) =>
 *   id.startsWith('u') ? { id, name: 'John Doe' } : null,
 * );
 *
 * const option = Option.pipe(
 *   Option.some('u123'),
 *   Option.andThen(findUser),
 *   Option.map((user) => user.name),
 * );
 *
 * if (Option.isSome(option)) {
 *   console.log(option.value); // John Doe
 * }
 * ```
 *
 * @example Shorthand Usage
 * ```ts
 * import { O } from 'byenull';
 *
 * const findUser = O.fn((id: string) =>
 *   id.startsWith('u') ? { id, name: 'John Doe' } : null,
 * );
 *
 * const option = O.pipe(
 *   O.some('u123'),
 *   O.andThen(findUser),
 *   O.map((user) => user.name),
 * );
 *
 * if (O.isSome(option)) {
 *   console.log(option.value); // John Doe
 * }
 * ```
 */
export * as Option from "./exports";

/**
 * Shorthand alias for {@link Option}.
 */
export * as O from "./exports";
