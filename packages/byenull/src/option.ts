import type { HasPromise } from "./internals/has-promise";

/**
 * The type of a value that is neither `null` nor `undefined`.
 *
 * Accepts every type except `null` and `undefined`, which is exactly the set
 * of values an {@link Option} can hold in its {@link Some} variant.
 *
 * @category Core Types
 */
export type NonNullableValue = {};

/**
 * The variant of an {@link Option} that holds a value.
 *
 * @typeParam T - The type of the held value.
 *
 * @category Core Types
 */
export type Some<T> = {
  readonly type: "Some";
  readonly value: T;
};

/**
 * The variant of an {@link Option} that holds no value.
 *
 * @category Core Types
 */
export type None = {
  readonly type: "None";
};

/**
 * Represents the presence or absence of a value.
 *
 * An `Option` is always one of two variants:
 *
 * - {@link Some}: the operation produced a value.
 * - {@link None}: the operation produced no value.
 *
 * Because it is a plain object with a `type` property, an `Option` can be
 * logged, serialized to JSON, or compared in tests as it is.
 *
 * @typeParam T - The type of the value held by a {@link Some}.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * const divide = (a: number, b: number): Option.Option<number> => {
 *   if (b === 0) {
 *     return Option.none();
 *   }
 *   return Option.some(a / b);
 * };
 *
 * divide(10, 2); // { type: 'Some', value: 5 }
 * divide(10, 0); // { type: 'None' }
 * ```
 *
 * @category Core Types
 */
export type Option<T> = Some<T> | None;

/**
 * An asynchronous {@link Option}: the `Promise` of an `Option`.
 *
 * Produced by {@link fn} and {@link maybe} when they wrap an asynchronous
 * function, and by every transformer when its input is asynchronous.
 *
 * @typeParam T - The type of the value held by a {@link Some}.
 *
 * @category Core Types
 */
export type OptionAsync<T> = Promise<Option<T>>;

/**
 * An {@link Option} that may already be resolved, or may still be a `Promise`.
 *
 * Every transformer in this package accepts this type and dispatches on it:
 * a resolved `Option` is transformed synchronously, a `Promise` is awaited
 * and the result is an {@link OptionAsync}.
 *
 * @typeParam T - The type of the value held by a {@link Some}.
 *
 * @category Core Types
 */
export type OptionMaybeAsync<T> = Option<T> | Promise<Option<T>>;

/**
 * Resolves to {@link OptionAsync} when `O` may be a `Promise`, otherwise to
 * {@link Option}.
 *
 * Used as the return type of every transformer so that a synchronous input
 * yields a synchronous `Option` and an asynchronous input yields an
 * `OptionAsync`, without separate APIs.
 *
 * @typeParam O - The input type that may contain a `Promise`.
 * @typeParam T - The type of the value held by the resulting {@link Some}.
 *
 * @category Infer Types
 */
export type OptionFor<O, T> = true extends HasPromise<O> ? OptionAsync<T> : Option<T>;

/**
 * Infers the value type of an {@link Option}, {@link OptionAsync}, or a
 * function returning either.
 *
 * @typeParam T - The type to infer the value type from.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * type A = Option.InferSome<Option.Option<number>>; // number
 * type B = Option.InferSome<Option.OptionAsync<number>>; // number
 * type C = Option.InferSome<() => Option.Option<number>>; // number
 * ```
 *
 * @category Infer Types
 */
export type InferSome<T> = [T] extends [(...args: any[]) => OptionMaybeAsync<infer U>]
  ? U
  : [T] extends [OptionMaybeAsync<infer U>]
    ? U
    : never;
