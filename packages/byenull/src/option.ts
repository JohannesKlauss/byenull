import type { HasPromise } from "./internals/has-promise";

/**
 * A value that is neither `null` nor `undefined`.
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
 * A union type representing either a {@link Some} or a {@link None}.
 *
 * @typeParam T - The type of the {@link Some} value.
 *
 * @example
 * ```ts
 * import { Option } from 'byenull';
 *
 * const doSomething = (): Option.Option<number> => {
 *   return Math.random() > 0.5
 *     ? Option.some(10)
 *     : Option.none();
 * };
 * ```
 *
 * @category Core Types
 */
export type Option<T> = Some<T> | None;

/**
 * An asynchronous variant of {@link Option}, wrapped in a `Promise`.
 *
 * @typeParam T - The type of the {@link Some} value.
 *
 * @category Core Types
 */
export type OptionAsync<T> = Promise<Option<T>>;

/**
 * An option that may be either synchronous or asynchronous.
 *
 * @typeParam T - The type of the {@link Some} value.
 *
 * @category Core Types
 */
export type OptionMaybeAsync<T> = Option<T> | Promise<Option<T>>;

/**
 * Resolves to the appropriate Option type (sync or async) based on the input type.
 *
 * @typeParam O - The reference type to inspect for a Promise.
 * @typeParam T - The type of the {@link Some} value.
 *
 * @category Infer Types
 */
export type OptionFor<O, T> = true extends HasPromise<O> ? OptionAsync<T> : Option<T>;

/**
 * Infers the {@link Some} value type `T` from an Option or a function returning an Option.
 *
 * @typeParam T - An {@link OptionMaybeAsync} type or a function returning it.
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
