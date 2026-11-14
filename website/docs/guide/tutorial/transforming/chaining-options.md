---
description: Chain Option-returning steps with andThen, including sequential lookups, asynchronous work, and None short-circuiting.
---

# Chaining options

`andThen` runs a step that returns another `Option`. It uses the returned Option directly, so dependent lookups and asynchronous steps can share one pipeline.

## Chaining steps with `andThen`

For a `Some`, `andThen` calls the function with the inner value. The function can return either a `Some` or a `None`. If the input is already `None`, the function is not called:

```ts
import { Option } from "byenull";

const doubled = Option.pipe(
  Option.some(3),
  Option.andThen((value) => Option.some(value * 2)),
);
// { type: 'Some', value: 6 }

const rejected = Option.pipe(
  Option.some(3),
  Option.andThen(() => Option.none()),
);
// { type: 'None' }

const skipped = Option.pipe(
  Option.none(),
  Option.andThen((value: number) => Option.some(value * 2)),
);
// { type: 'None' }, the callback is not called
```

Unlike `map`, `andThen` does not nest an Option returned by its callback. The returned Option becomes the input to the next step.

## Chaining sequential lookups

Use `andThen` when a later lookup needs a value from an earlier one. A missing user or team stops the rest of the chain:

```ts
import { Option } from "byenull";

type User = { id: string; teamId: string };
type Team = { id: string; name: string };

const users: User[] = [{ id: "u1", teamId: "t1" }];
const teams: Team[] = [{ id: "t1", name: "Docs" }];

const findUser = Option.fn((id: string) => users.find((user) => user.id === id));
const findTeam = Option.fn((id: string) => teams.find((team) => team.id === id));

const team = Option.pipe(
  Option.some("u1"),
  Option.andThen(findUser),
  Option.andThen((user) => findTeam(user.teamId)),
);
// { type: 'Some', value: { id: 't1', name: 'Docs' } }

const missing = Option.pipe(
  Option.some("u404"),
  Option.andThen(findUser),
  Option.andThen((user) => findTeam(user.teamId)),
);
// { type: 'None' }, the team lookup is not called
```

Each callback receives a plain value, not an Option. The pipeline handles the wrapping between steps.

## Using asynchronous steps

An `andThen` callback can return an `OptionAsync`. Later Promise-aware steps wait for it, so `map` receives the resolved value:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const fetchUser = Option.fn(async (id: string) => {
  const user: User = { id: "u1", name: "Alice" };
  return id === user.id ? user : null;
});

const userName = await Option.pipe(
  Option.some("u1"),
  Option.andThen(fetchUser),
  Option.map((user) => user.name),
);
// { type: 'Some', value: 'Alice' }
```

The `fn` wrapper converts a nullish resolution or Promise rejection to `None`. Either outcome skips the following `map`. Await the pipeline once to get its final Option.

For more on mixing synchronous and asynchronous work, see [How to mix sync and async Options](../../how-to/writing-async-pipelines) and [The sync/async model](../../explanation/sync-and-async).

`andThen` does not recover from a `None`. To continue with a fallback Option, use [`orElse`](./recovering-options).
