---
description: Creating Options with some and none, wrapping nullable-returning functions with fn and maybe, and normalizing nullish values into None.
---

# Creating Options

Now that we know what an `Option` looks like, let's create them with the library's helper functions and point our user lookup at the directory from the last chapter.

## Creating a Some with `some`

`some` creates a `Some` that holds the given value:

```ts
import { Option } from "byenull";

const option = Option.some(42);
// { type: 'Some', value: 42 }
```

`some` also normalizes: passing `null` or `undefined` returns a `None`, so a `Some` always holds a real value:

```ts
import { Option } from "byenull";

Option.some(null);
// { type: 'None' }

Option.some(undefined);
// { type: 'None' }
```

This makes `some` handy at the edge of our code, where nullable values arrive from the outside:

```ts
import { Option } from "byenull";

const settings = new Map<string, string>([["theme", "dark"]]);

Option.some(settings.get("theme"));
// { type: 'Some', value: 'dark' }

Option.some(settings.get("language"));
// { type: 'None' }
```

## Creating a None with `none`

`none` creates the Option that holds nothing:

```ts
import { Option } from "byenull";

const option = Option.none();
// { type: 'None' }
```

## Returning Options from functions

The most common way to use `some` and `none` is to return them from our own functions, in place of `null` or `undefined`:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const findUser = (id: string, users: User[]): Option.Option<User> => {
  const user = users.find((user) => user.id === id);
  if (user === undefined) {
    return Option.none();
  }
  return Option.some(user);
};

findUser("u1", [{ id: "u1", name: "Alice" }]);
// { type: 'Some', value: { id: 'u1', name: 'Alice' } }

findUser("u404", [{ id: "u1", name: "Alice" }]);
// { type: 'None' }
```

## Wrapping lookups with `fn`

Writing the `if` by hand gets repetitive. `fn` wraps a function that may return a nullish value, so the wrapping happens once:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
type Profile = { userId: string; displayName?: string };

const users: User[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];
const profiles: Profile[] = [{ userId: "u1", displayName: "Alice A." }];
// ---cut-before---
const findUser = Option.fn((id: string, users: User[]) =>
  users.find((user) => user.id === id)
);

const findProfile = Option.fn((userId: string, profiles: Profile[]) =>
  profiles.find((profile) => profile.userId === userId),
);

findUser("u1", users);
// { type: 'Some', value: { id: 'u1', name: 'Alice' } }

findProfile("u2", profiles);
// Bob has no profile: { type: 'None' }
```

The wrapped function keeps its parameters, and its nullish results become `None`.

:::info
`fn` converts nullish _return values_. If the wrapped function throws synchronously, the throw still propagates. See [Design Principles](../../explanation/design-principles) for why.
:::

## Running a lookup immediately with `maybe`

`maybe` runs a thunk, a function with no parameters, and wraps its result:

```ts
import { Option } from "byenull";

const theme = Option.maybe(() => document.querySelector('meta[name="theme-color"]'));
// Some<HTMLMetaElement> or None
```

Use `maybe` when there is nothing to pass, and `fn` when there is.

## Async wrappers

Both `fn` and `maybe` handle asynchronous functions: the result becomes an `OptionAsync`, and a rejected promise becomes a `None`:

```ts
import { Option } from "byenull";

type Avatar = { url: string };

const fetchAvatar = Option.fn(async (userId: string) => {
  const response = await fetch(`/api/avatars/${userId}`);
  return response.json() as Promise<Avatar | null>;
});

const avatar = await fetchAvatar("u1");
// Some<Avatar>, or None when the request failed or returned null
```

We will use this fetch in the [chaining chapter](../transforming/chaining-options).
