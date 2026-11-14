---
description: "Recovering from a None with orElse: catching an empty step and continuing with a fallback Option, synchronously or asynchronously."
---

# Recovering Options

A `None` skips the rest of a pipeline. In this chapter we will catch that `None` with `orElse` and continue with a fallback, so our profile lookup degrades gracefully instead of ending empty.

## Providing a fallback with `orElse`

`orElse` takes a thunk, a function with no parameters, that returns the fallback Option.
If the input is a `Some`, the thunk is never called:

```ts
import { Option } from "byenull";

const recovered = Option.pipe(
  Option.none(),
  Option.orElse(() => Option.some("fallback")),
);
// { type: 'Some', value: 'fallback' }

const unchanged = Option.pipe(
  Option.some("value"),
  Option.orElse(() => Option.some("fallback")),
);
// { type: 'Some', value: 'value' }, the thunk never ran
```

## Our project: falling back to the user name

Our chain from the last chapter ends in a `None` when a user has no profile, and with it, no display name.
With `orElse`, we catch that and fall back to the user's own name:

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

const displayName = (id: string) =>
  Option.pipe(
    findUser(id, users),
    Option.andThen((user) =>
      Option.pipe(
        findProfile(user.id, profiles),
        Option.andThen((profile) => Option.some(profile.displayName)),
        Option.orElse(() => Option.some(user.name)), // no display name → user's name
      ),
    ),
    Option.unwrap("Guest"),
  );

displayName("u1"); // 'Alice A.'
displayName("u2"); // 'Bob', no profile, name fallback
displayName("u404"); // 'Guest', no user at all
```

Notice where the `orElse` sits: **inside** the inner pipeline, right after the step it recovers.
If we placed it at the very end of the outer pipeline instead, a missing _user_ would also produce the name fallback, which is the wrong meaning.
The rule: `orElse` answers "what do I do when _this step_ is empty", so it belongs where that step ends.

Also notice the inner `Option.some(profile.displayName)`. The `some` call turns the optional `displayName` (`string | undefined`) into an Option, converting `undefined` into the `None` that `orElse` then catches. This combination, `andThen` with `some` and then `orElse`, is the standard shape for "use the optional field, or fall back".

## Async recovery

The fallback thunk can be asynchronous, for example a cache that misses and falls back to a network read:

```ts
import { Option } from "byenull";

declare function readCache(key: string): string | null;
declare function fetchSetting(key: string): Promise<string | null>;
// ---cut-before---
const setting = await Option.pipe(
  Option.some(readCache("theme")),
  Option.orElse(() => Option.maybe(() => fetchSetting("theme"))),
  Option.unwrap("light"),
);
// string: cached value, fetched value, or 'light'
```

## `orElse` vs `unwrap`

`orElse` recovers with another **Option**. The pipeline continues in the world of Options.
`unwrap`, which we meet in the next chapter, recovers with a plain **value** and ends the pipeline.
Use `orElse` when later steps still need to run, and `unwrap` at the end.

## Next steps

- [Unwrapping Options](../resolving/unwrapping-options): getting a plain value out at the end
