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

byenull makes the same absence explicit in the return type. A pipeline can then transform the value or supply a default without another nullish check:

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

## Option or Result

None records that no value is available. It deliberately carries no reason. This suits array lookups, optional settings, DOM queries, and other operations where absence needs no explanation.

Use a Result when the caller needs an error, a cause, or another failure detail. `Option.toResult(error)` turns Some into Success and None into Failure containing the supplied error. `Option.fromResult` turns Success into Some and Failure into None, discarding the Failure error. Convert in that direction only when the error no longer matters.

The [quick start](./quick.md) applies these operations to lookups, fallbacks, and asynchronous work.
