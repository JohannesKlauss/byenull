---
description: "Chaining steps that can come up empty with andThen: sequencing lookups, mixing synchronous and asynchronous steps, and letting None skip the remaining work."
---

# Chaining Options

In this chapter we will chain the lookups of our project into one pipeline with `andThen`. `andThen` is the tool for steps that may come up empty: the callback receives the value of a `Some` and returns the next Option.

## Chaining a second lookup

Our project chains two lookups: find the user, then find their profile.
`andThen` sequences them, and a `None` anywhere skips everything after it:

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
const findProfile = Option.fn((userId: string, profiles: Profile[]) =>
  profiles.find((profile) => profile.userId === userId),
);

const profile = Option.pipe(
  Option.some("u1"),
  Option.andThen((id) => findUser(id, users)),
  Option.andThen((user) => findProfile(user.id, profiles)),
);
// { type: 'Some', value: { userId: 'u1', displayName: 'Alice A.' } }

const missing = Option.pipe(
  Option.some("u404"),
  Option.andThen((id) => findUser(id, users)),
  Option.andThen((user) => findProfile(user.id, profiles)), // never runs
);
// { type: 'None' }
```

In the second pipeline, the first `andThen` produces a `None`, so the second one is never called. Its callback does not run, exactly like the `isNone` early-return from the checking chapter, but without the `if`.

## The callback returns the next Option

The rule for `andThen`: the callback gets the current value and returns an `Option` (or an `OptionAsync`).
This is what makes it a chain. Each step decides whether the next value exists:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const findProfile = Option.fn((userId: string, profiles: { userId: string }[]) =>
  profiles.find((profile) => profile.userId === userId),
);

declare const users: User[];
declare const profiles: { userId: string }[];
// ---cut-before---
const step = Option.andThen((id: string) => findUser(id, users));
// step takes an Option<string> and returns an Option<User>

const chain = Option.pipe(
  Option.some("u1"),
  step, // Option<User>
  Option.andThen((user: User) => findProfile(user.id, profiles)), // Option<{ userId: string }>
);
```

## Mixing sync and async steps

When a step's callback returns a `Promise`, like our avatar fetch, the chain becomes asynchronous and the following steps receive the resolved value.
We `await` once, at the end:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
type Avatar = { url: string };

const users: User[] = [{ id: "u1", name: "Alice" }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const fetchAvatar = Option.fn(async (user: User) => {
  const response = await fetch(`/api/avatars/${user.id}`);
  return response.json() as Promise<Avatar | null>;
});

const avatarUrl = await Option.pipe(
  Option.some("u1"),
  Option.andThen((id) => findUser(id, users)), // sync step
  Option.andThen(fetchAvatar), // async step
  Option.map((avatar) => avatar.url), // runs on the resolved value
);
// Option<string>
```

The type of the pipeline widens to `OptionAsync` the moment one step is asynchronous. See [The Sync/Async Model](../../explanation/sync-and-async) for how that works.

## The complete chain

With chaining, the full profile lookup reads as one flow:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
type Profile = { userId: string; displayName?: string };
type Avatar = { url: string };

const users: User[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];
const profiles: Profile[] = [{ userId: "u1", displayName: "Alice A." }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));
const findProfile = Option.fn((userId: string, profiles: Profile[]) =>
  profiles.find((profile) => profile.userId === userId),
);
const fetchAvatar = Option.fn(async (user: User) => {
  const response = await fetch(`/api/avatars/${user.id}`);
  return response.json() as Promise<Avatar | null>;
});

const avatarFor = (id: string) =>
  Option.pipe(
    Option.some(id),
    Option.andThen((id) => findUser(id, users)),
    Option.andThen((user) => findProfile(user.id, profiles)),
    Option.andThen((profile) => fetchAvatar(profile.userId)), // async step
  );

await avatarFor("u1"); // Option<Avatar>, or None at the first empty step
await avatarFor("u404"); // { type: 'None' }
```

One pipeline, three lookups, no `if` statements.

## Next steps

A `None` skips the rest of the pipeline, but sometimes we want to catch it and continue with a fallback. That is the next chapter: [Recovering Options](./recovering-options).
