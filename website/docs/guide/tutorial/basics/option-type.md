---
description: "The structure of Option: the Some and None union, OptionAsync for async operations, and utility types such as OptionMaybeAsync, InferSome, and OptionFor."
---

# Option type

In this tutorial we will build a small profile lookup: given a user ID, we will find a user, read their optional profile, and produce a display name, handling every "maybe it's not there" along the way. Before we write any function, let's look at what an `Option` actually is.

## What is an Option?

An `Option` represents the outcome of a lookup that may come up empty.
It is always one of two variants. A `Some` means the lookup produced a value. A `None` means it produced nothing.

Unlike returning `null`, returning an `Option` encodes the possibility of absence in the type system itself.

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

Because it is just an object, an `Option` can be logged, serialized to JSON, or compared in tests as it is.
In practice, we rarely write these objects by hand. The next chapter shows the functions that create them.

## The union type

`Option.Option<T>` is the union of `Some<T>` and `None`.
`T` is the type of the value:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

// Returns either a Some<User> or a None
const findUser = (id: string, users: User[]): Option.Option<User> => {
  const user = users.find((user) => user.id === id);
  if (user === undefined) {
    return Option.none();
  }
  return Option.some(user);
};
```

A `None` never carries a value, so there is only one `None` type, and it is not generic.

## Why use an Option instead of nullish checks?

With a nullable return type, the ambiguity follows the value everywhere, and every consumer has to re-check.
With an `Option`, the check happens once, and the value types flow through every further step.

We will see the composing part in the [transforming chapters](../transforming/pipe-basics).
For the reasoning behind the split, see [Option vs null and undefined](../../explanation/option-vs-null).

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

## Utility types

The remaining types are helpers that the library uses in its signatures. We will meet them in the editor rather than write them ourselves:

```ts
import { Option } from "byenull";

type A = Option.OptionMaybeAsync<number>; // Option<number> | Promise<Option<number>>
type B = Option.InferSome<Option.Option<number>>; // number
type C = Option.OptionFor<Option.OptionAsync<number>, string>; // OptionAsync<string>
```

## Our project

Here is the data we will build on throughout the tutorial, a user directory and optional profiles:

```ts
type User = { id: string; name: string };
type Profile = { userId: string; displayName?: string; avatarUrl?: string };

const users: User[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];

const profiles: Profile[] = [{ userId: "u1", displayName: "Alice A." }];
```

`Bob` has no profile, and `u404` is not a user at all. Those are exactly the cases our lookup will handle with Options.

## Next steps

In the next chapter we create Options with the library's helper functions: [Creating Options](./creating-options).
