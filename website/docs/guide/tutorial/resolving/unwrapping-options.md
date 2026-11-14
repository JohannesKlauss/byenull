---
description: "Ending a pipeline with unwrap: extracting the value of a Some, returning a default for a None, and awaiting unwrapped async Options."
---

# Unwrapping Options

Pipelines live in the world of Options; the rest of our program usually wants a plain value. In this final function chapter we will end our pipeline with `unwrap`.

## Getting the value out with `unwrap`

`unwrap` takes a default value and returns the value of a `Some`, or the default for a `None`:

```ts
import { Option } from "byenull";

const empty: Option.Option<number> = Option.none();

const fallback = Option.pipe(empty, Option.unwrap(0));
// 0
```

After `unwrap`, the result is a plain value. The pipeline is over.

## Our project: the final display name

We have used `unwrap('Guest')` at the end of our pipelines already. Here is the complete project in one place, ending in a plain `string`:

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

const displayName = (id: string): string =>
  Option.pipe(
    findUser(id, users),
    Option.andThen((user) =>
      Option.pipe(
        findProfile(user.id, profiles),
        Option.andThen((profile) => Option.some(profile.displayName)),
        Option.orElse(() => Option.some(user.name)),
      ),
    ),
    Option.unwrap("Guest"),
  );

displayName("u1"); // 'Alice A.'
displayName("u2"); // 'Bob'
displayName("u404"); // 'Guest'
```

From a nullable `find` to a guaranteed `string`, with every fallback visible on its own line.

## The default must fit the value type

The default has to be assignable to the Option's value type, or be `null` or `undefined`:

```ts
import { Option } from "byenull";

const a = Option.pipe(Option.some(2), Option.unwrap(0)); // number
const b = Option.pipe(Option.some(2), Option.unwrap(null)); // number | null
```

If the default's type does not match, the compiler tells us. That guards against unwrapping an Option of numbers with, say, a string fallback by accident.

## Unwrapping async Options

When the input is an `OptionAsync`, `unwrap` returns a `Promise` of the value or default, so we `await` it:

```ts
import { Option } from "byenull";

const value = await Option.unwrap(0)(Promise.resolve(Option.some(42)));
// 42
```

## Checking instead of unwrapping

`unwrap` is the right end for "value or default".
When the empty case is _not_ acceptable, when it means something went wrong that someone must know about, end with a check (`isSome` / `isNone`) or convert to a `Result`.
That is the subject of the last chapter: [Converting to Results](./converting-to-results).
