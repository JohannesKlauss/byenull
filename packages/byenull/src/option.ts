import type { HasPromise } from "./internals/has-promise";

export type NonNullableValue = {};

export type Some<T> = {
  readonly type: "Some";
  readonly value: T;
};

export type None = {
  readonly type: "None";
};

export type Option<T> = Some<T> | None;

export type OptionAsync<T> = Promise<Option<T>>;

export type OptionMaybeAsync<T> = Option<T> | Promise<Option<T>>;

export type OptionFor<O, T> = true extends HasPromise<O> ? OptionAsync<T> : Option<T>;

export type InferSome<T> = [T] extends [(...args: any[]) => OptionMaybeAsync<infer U>]
  ? U
  : [T] extends [OptionMaybeAsync<infer U>]
    ? U
    : never;
