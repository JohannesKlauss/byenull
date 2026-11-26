---
description: "The structure of Option: the Some and None union, OptionAsync for async operations, and utility types such as OptionMaybeAsync, InferSome, and OptionFor."
---

# Option type

In this tutorial we will build a small profile lookup: given a user ID, we will find a user, read their optional profile, and produce a display name, handling every "maybe it's not there" along the way. Before we write any function, let's look at what an `Option` actually is.

## What is an Option?

An `Option` represents the outcome of a lookup that may come up empty.
It is always one of two variants:

- `Some` means the lookup produced a value.
- `None` means it produced nothing.

In some languages and libraries this is also called a `Maybe` type.

## The structure

An `Option` is a plain object with a `type` property that tells the two variants apart:

```ts
import { Option } from "byenull";

// A Some holds a value
const some: Option.Some<number> = {
  type: "Some",
  value: 42,
};

// A None holds nothing
const none: Option.None = {
  type: "None",
};
```

Because it is just an object, an `Option` can be logged, serialized to JSON, send freely between server and client or compared in tests as it is.
In practice, we rarely write these objects by hand. The next chapter shows the functions that create them.

## The union type

`Option.Option<T>` is the union of `Some<T>` and `None`.
`T` is the type of the value:

```ts
import { Option } from "byenull";

// Returns either a Some<number> or a None
const divide = (a: number, b: number): Option.Option<number> => {
  if (b === 0) {
    return Option.none();
  }
  return Option.some(a / b);
};
```

A `None` never carries a value, so there is only one `None` type, and it is not generic.

## Why use an Option instead of nullish checks?

### 1. One way to define missing value

In TypeScript we have multiple ways of defining a value that might be absent.

```ts
type User = { name: string | null; avatar?: string | null; age: number | undefined };
```

With `Option` we can make this uniform:

```ts
import { Option } from "byenull";
// ---cut-before---
type User = {
  name: Option.Option<string>;
  avatar: Option.Option<string>;
  age: Option.Option<number>;
};
```

### 2. Option composes

Options can be chained, collecting possible some types in a union automatically and skipping steps when a value is None.
We'll learn more about piping and transforming in [Chaining Options](../transforming/chaining-options).

```ts
import { Option } from "byenull";

const divide = (a: number, b: number): Option.Option<number> => {
  if (b === 0) {
    return Option.none();
  }
  return Option.some(a / b);
};

const square = (a: number): number => {
  return a * a;
};

const squareRoot = (a: number): Option.Option<number> => {
  const res = Math.sqrt(a);

  return Number.isNaN(res) ? Option.none() : Option.some(res);
};

const divisor = Math.random();
// ---cut-before---
const result = Option.pipe(
  Option.some(2),
  Option.andThen((val) => divide(val, divisor)),
  Option.map(square),
  Option.andThen(squareRoot),
  Option.unwrap(0),
);
```

## Async Options

An asynchronous `Option` is represented by `OptionAsync<T>`, which is simply an alias for `Promise<Option<T>>`:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const fetchUser = async (id: string): Promise<Option.Option<User>> => {
  const response = await fetch(`/api/users/${id}`);
  const user = (await response.json()) as User | null;
  return Option.some(user);
};

// fetchUser('u123') is an OptionAsync<User>
```

Every function in byenull accepts an `Option`, an `OptionAsync`, or either one. There are no separate `mapAsync`-style functions.
