---
description: "Transforming the value inside an Option with map: applying functions to Some values, leaving None unchanged, and preserving the value's type through the pipeline."
---

# Mapping Options

In this chapter we will transform values inside our pipeline with `map`. Where `andThen` chains a step that can come up empty, `map` simply changes what a `Some` holds.

## Transforming a Some with `map`

`map` applies a function to the value of a `Some`.
A `None` passes through unchanged:

```ts
import { Option } from "byenull";

const option = Option.pipe(
  Option.some(2),
  Option.map((x) => x * 10),
);
// { type: 'Some', value: 20 }

const empty = Option.pipe(
  Option.none(),
  Option.map((x: number) => x * 10),
);
// { type: 'None' }
```

The callback only runs when there is a value. The second pipeline never calls its function.

## Our project: building a display name

Let's use `map` where our profile data is guaranteed once we have it, turning a profile into a label:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
type Profile = { userId: string; displayName?: string };

const users: User[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];
const profiles: Profile[] = [{ userId: "u1", displayName: "Alice A." }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const userLabel = Option.pipe(
  findUser("u1", users),
  Option.map((user) => `${user.name} (#${user.id})`),
);
// { type: 'Some', value: 'Alice (#u1)' }
```

Notice the types: `map` receives the `User` and its callback returns a `string`, so the result is an `Option<string>`. The transform flows into the pipeline's type automatically.

## `map` works on async Options

When the input is an `OptionAsync`, `map` waits for it and returns an `OptionAsync`, so no separate function is needed:

```ts
import { Option } from "byenull";

type Avatar = { url: string };

declare const fetchAvatar: (userId: string) => Promise<Option.Option<Avatar>>;
// ---cut-before---
const avatarUrl = await Option.pipe(
  fetchAvatar("u1"), // OptionAsync<Avatar>
  Option.map((avatar) => avatar.url),
);
// Option<string>
```

## When to use `map` and when to use `andThen`

Use `map` when the callback returns a plain value, and `andThen` when it returns an Option, typically because the next step can itself come up empty.
If we accidentally use `map` with a function that returns an Option, we get an `Option` _inside_ an `Option`, which the pipeline won't flatten:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
type Profile = { userId: string; displayName?: string };

const users: User[] = [{ id: "u1", name: "Alice" }];
const profiles: Profile[] = [];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));
const findProfile = Option.fn((userId: string, profiles: Profile[]) =>
  profiles.find((profile) => profile.userId === userId),
);

const nested = Option.pipe(
  findUser("u1", users),
  Option.map((user) => findProfile(user.id, profiles)),
);
// Option<Option<Profile>>, not what we want

const flat = Option.pipe(
  findUser("u1", users),
  Option.andThen((user) => findProfile(user.id, profiles)),
);
// Option<Profile>: { type: 'None' }, because Alice has no profile
```

The next chapter makes `andThen` the star.

## Next steps

- [Chaining Options](./chaining-options): steps that can come up empty
