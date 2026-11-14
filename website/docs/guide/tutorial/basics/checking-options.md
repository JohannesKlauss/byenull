---
description: "Checking Options with isSome, isNone, and isOption: narrowing the type so value access is safe, and verifying unknown values."
---

# Checking Options

We can create Options now. In this chapter we look inside them, safely. Because an `Option` is a discriminated union, checking the `type` with a type guard narrows the type so `value` is available without a cast.

## Checking for a Some with `isSome`

`isSome` returns `true` when the Option holds a value, and narrows the type in the branch:

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

const user = findUser("u1", users);

if (Option.isSome(user)) {
  console.log(user.value); // { id: 'u1', name: 'Alice' }
} else {
  console.log("No such user");
}
```

Inside the `if` branch, TypeScript knows the Option is a `Some`, so `user.value` is the `User`.

## Checking for a None with `isNone`

`isNone` is the mirror image. It narrows to the variant without a value:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const user = findUser("u404", [{ id: "u1", name: "Alice" }]);

if (Option.isNone(user)) {
  console.log("User not found"); // this branch runs
}
```

## Both guards work on our project

Let's combine the guards to render a profile, the first place our lookup produces something visible:

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

const displayName = (id: string): string => {
  const user = findUser(id, users);
  if (Option.isNone(user)) {
    return "Guest";
  }
  const profile = findProfile(user.value.id, profiles);
  if (Option.isSome(profile) && profile.value.displayName !== undefined) {
    return profile.value.displayName;
  }
  return user.value.name;
};

displayName("u1"); // 'Alice A.'
displayName("u2"); // 'Bob', no profile, falls back to the name
displayName("u404"); // 'Guest', no user at all
```

This works, but notice the shape: two `if` blocks, nested lookups, and the absence-handling mixed into the happy path.
Every following chapter of this tutorial replaces part of this with a single composed pipeline.

## Checking unknown values with `isOption`

`isOption` checks whether an arbitrary value is an Option at all, which is useful when data arrives untyped, for example from `JSON.parse` or a message channel:

```ts
import { Option } from "byenull";

const value: unknown = { type: "Some", value: 42 };

if (Option.isOption<number>(value)) {
  // value is Option<number>
  console.log(Option.isSome(value)); // true
}
```

## Next steps

Checking works, but composing beats checking. In the next chapter we meet `pipe`: [Pipe basics](../transforming/pipe-basics).
