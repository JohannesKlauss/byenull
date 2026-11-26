---
description: Run side effects such as logging at any step of a pipeline with inspect and inspectNone, without changing the Option that flows through it.
---

# Inspecting options

When a pipeline doesn't behave as expected, you want to see the value at each step. `inspect` and `inspectNone` let you run a side effect, such as logging, without affecting the `Option` that flows through the pipeline.

## Observing values with `inspect`

For a `Some`, `inspect` calls the given function with the inner value, ignores its result, and returns the original `Option` unchanged. For a `None`, the function is not called:

```ts
import { Option } from "byenull";

const found = Option.pipe(
  Option.some(42),
  Option.inspect((value) => console.log("Value:", value)),
  Option.map((value) => value * 2),
);
// Console: "Value: 42"
// { type: 'Some', value: 84 }

const missing = Option.pipe(
  Option.none(),
  Option.inspect((value: number) => console.log("Value:", value)), // Not called
);
// { type: 'None' }
```

Unlike `map`, the callback does not produce the next pipeline value. It must return `void` or a `Promise<void>`, so the type checker keeps `inspect` focused on side effects.

## Observing `None` with `inspectNone`

`inspectNone` is the counterpart of `inspect` for missing values. It calls the given function for a `None` and does nothing for a `Some`. The callback takes no parameters, because a `None` holds no value:

```ts
import { Option } from "byenull";

const missing = Option.pipe(
  Option.none(),
  Option.inspectNone(() => console.warn("No value present")),
);
// Console: "No value present"
// { type: 'None' }

const found = Option.pipe(
  Option.some(42),
  Option.inspectNone(() => console.warn("No value present")), // Not called
);
// { type: 'Some', value: 42 }
```

## Tracing a pipeline

Insert `inspect` between the steps you want to observe, and `inspectNone` at the end to log when a lookup came up empty:

```ts
import { Option } from "byenull";

type User = { id: string; name: string; avatarId: string };
type Avatar = { id: string; url: string };

const users = new Map<string, User>([
  ["u1", { id: "u1", name: "Alice", avatarId: "a1" }],
  ["u2", { id: "u2", name: "Bob", avatarId: "a2" }],
]);
const avatars = new Map<string, Avatar>([
  ["a1", { id: "a1", url: "https://cdn.example.com/a1.png" }],
]);

const findUser = Option.fn((id: string) => users.get(id));
const findAvatar = Option.fn((avatarId: string) => avatars.get(avatarId));

const avatarUrl = Option.pipe(
  findUser("u1"),
  Option.inspect((user) => console.log("Found user:", user.name)),
  Option.andThen((user) => findAvatar(user.avatarId)),
  Option.map((avatar) => avatar.url),
  Option.inspectNone(() => console.warn("No user or avatar found")),
);
// Console: "Found user: Alice"
// { type: 'Some', value: 'https://cdn.example.com/a1.png' }

const missing = Option.pipe(
  findUser("u2"),
  Option.inspect((user) => console.log("Found user:", user.name)),
  Option.andThen((user) => findAvatar(user.avatarId)),
  Option.map((avatar) => avatar.url),
  Option.inspectNone(() => console.warn("No user or avatar found")),
);
// Console: "Found user: Bob"
// Console: "No user or avatar found"
// { type: 'None' }
```

The second pipeline shows both callbacks in their natural roles: the user is found, so `inspect` logs the name, and the missing avatar leaves the pipeline at `None`, where `inspectNone` reports it.

## Things to keep in mind

- **The callback result is ignored.** Whatever the callback does, the original `Option` is passed on. If a step should influence the pipeline, use [`andThen`](./chaining-options) with a callback that returns an Option instead.
- **Async callbacks are awaited.** A callback that returns a `Promise` makes the step asynchronous: the pipeline waits for the side effect before continuing, and the step widens the pipeline type like any other async step. See [Mixing sync and async](../../how-to/writing-async-pipelines).
- **Not only for debugging.** Placing `inspect` and `inspectNone` at the end of a pipeline is a simple way to act on the final outcome, such as printing the resolved value or logging that nothing was found.

## References

| API                                                  | Purpose                               |
| ---------------------------------------------------- | ------------------------------------- |
| [inspect(fn)](/api/functions/Option.inspect)         | Run a side effect on the `Some` value |
| [inspectNone(fn)](/api/functions/Option.inspectNone) | Run a side effect on a `None`         |
