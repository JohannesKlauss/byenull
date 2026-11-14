---
description: Overview of byenull, a lightweight, tree-shakable Option type library for type-safe nullable handling in TypeScript, usable standalone or as a companion to @praha/byethrow.
---

# Introduction

`byenull` is a lightweight, tree-shakable library that brings the `Option` type to JavaScript and TypeScript.
Instead of returning `null` or `undefined`, functions return a value that is either "some value" or "none".
The possibility of absence becomes part of the type, so the compiler can make sure it is handled.

byenull is designed as a companion to [byethrow](https://praha-inc.github.io/byethrow/), the excellent `Result` type library. It follows the same API design and converts between the two types at the boundary. You can also use it entirely on its own.

## At a glance

With nullish values, a lookup's ambiguity travels through your code, and every consumer has to re-check:

```ts
// @noErrors
type User = { id: string; name: string };
// ---cut-before---
// Did we find a user? The type can be undefined, so we must check everywhere.
const findUser = (id: string, users: User[]): User | undefined => {
  return users.find((user) => user.id === id);
};

const user = findUser("u123", users);
const name = user ? user.name : "unknown";
```

With byenull, the absence is resolved at the end of the computation:

```ts
type User = { id: string; name: string };
const users: User[] = [{ id: "u123", name: "Alice" }];
// ---cut-before---
import { Option } from "byenull";

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const name = Option.pipe(
  Option.some("u123"),
  Option.andThen((id) => findUser(id, users)),
  Option.map((user) => user.name),
  Option.unwrap("unknown"),
);
// 'Alice'
```

## Features

- **Tree-shakable.** Every function is an independent export, so your bundle only includes what you use.
- **Plain objects.** An `Option` is a plain object, not a class instance. It is easy to log, serialize, and debug.
- **One API for sync and async.** Every function accepts both `Option<T>` and `Promise<Option<T>>`.
- **Composable.** Build readable pipelines with `pipe` and combinators such as `map`, `andThen`, and `orElse`.
- **byethrow interop.** Convert between `Option` and `Result` with `toResult` and `fromResult`.
- **Fully type-safe.** Every function is covered by type tests, so value types are inferred precisely.

## When to use byenull

byenull works best for values that may legitimately be absent:

- Lookups in arrays, maps, and sets, such as `find`, `Map.get`, or a cache read
- Optional configuration, like environment variables, settings, and feature flags
- DOM queries and other APIs that return `null` for "not found"
- API responses where a field may be missing or a record may not exist

You don't need to wrap every value in an `Option`. When an operation _fails_ in a way that carries information, such as an error message, a cause, or a retry policy, use a `Result` instead. See [Option vs Result](../explanation/option-vs-result) for how to draw that line.

## Next steps

- [Why byenull?](./why): the problems `Option` solves, and how byenull compares to alternatives
- [Quick start](./quick): install byenull and run the core workflow in a few minutes
- [Tutorial](../tutorial/basics/option-type): every function step by step, building a small profile lookup
- [API Reference](/api/modules/Option): complete documentation of every type and function, generated from the source
