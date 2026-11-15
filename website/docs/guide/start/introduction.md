---
description: Learn how byenull represents absent values with Option, composes synchronous and asynchronous work, and converts to and from @praha/byethrow Results.
---

# Introduction

`byenull` is an `Option<T>` library for JavaScript and TypeScript. It is a companion to the excellent [`@praha/byethrow`](https://praha-inc.github.io/byethrow/), which provides the `Result<T, E>` type. Use byenull when a value may be absent and byethrow when a failure carries an error. Each library also works on its own.

## At a glance

JavaScript lookup APIs often return `undefined`. Optional chaining and a fallback handle a single lookup directly:

```ts
type User = { id: string; name: string };
const users: User[] = [{ id: "u123", name: "Alice" }];
// ---cut-before---
const findUser = (id: string) => users.find((user) => user.id === id);

const user = findUser("u123");
const name = user?.name ?? "Unknown";
```

byenull makes the same possible absence explicit in the return type. A pipeline can then transform the value (if there is one) or supply a default without checking for null or undefined in every step:

```ts
type User = { id: string; name: string };
const users: User[] = [{ id: "u123", name: "Alice" }];
// ---cut-before---
import { Option } from "byenull";

const findUser = Option.fn((id: string) => users.find((user) => user.id === id));

const name = Option.pipe(
  findUser("u123"),
  Option.map((user) => user.name),
  Option.unwrap("Unknown"),
);
// "Alice"
```

The `map` callback does not run after None. `unwrap` returns the value inside Some or the supplied default for None. It does not throw when the Option is empty.

## Features

- **Tree-shakable**: Every function is an independent export, so your bundle only includes what you use.
- **Plain objects**: A `Object` is a plain object, not a class instance. It is easy to log, serialize, and debug.
- **One API for sync and async**: Every function accepts both `Ooption<T>` and `Promise<Option<T>>`.
- **Composable**: Build readable pipelines with `pipe` and combinators such as `map`, `andThen`, and `andThrough`.
- **Interop**: Use `fromResult` and `toResult` to transform byethrow Results to Options and vice versa.
- **Focused**: A small set of Option-centric functions, without aliases or confusing variants.
- **Fully type-safe**: Every function is covered by type tests, so success and error types are inferred precisely.

## Option or Result

Use _Option_ when there might be no value available at the end of a computation and you don't care about errors or failures. This suits array lookups, optional settings, nested optional values and other operations where absence needs no explanation.

Use a _Result_ when the caller needs an error, a cause, or another failure detail to act upon. You can use `Option.toResult(error)` and  `Option.fromResult` to turn a Option type into a Result and vice versa.

## When to Use byenull

byenull works best for values that might be absent as part of your application's normal behavior, such as:

- **API/DB Return Values** can be null or undefined
- **Optional settings** where you can define a default
- **Collection lookups** that might return no value
- **Optional sub objects** on your domain types (i.e. a User without an Avatar Image)
- **Business rules** such as "missing Avatar image for User" or "the user has no permission"

You don't need to wrap every possible null or undefined in an `Option`.
DOM node lookups, one of operations and similar localized null checks can still be handled with the nullish coalescing operator.
See [Option vs null and undefined](../explanation/option-vs-nullish) for where to draw that line.
