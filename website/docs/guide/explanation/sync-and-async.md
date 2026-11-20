---
description: "How Promise-aware Option operations dispatch at runtime, how OptionFor types mixed unions, and why unwrap can return either a value or a Promise."
---

# Sync and async Options

An `OptionAsync<T>` is just an alias for `Promise<Option<T>>`. An `OptionMaybeAsync<T>` is the union `Option<T> | Promise<Option<T>>`. byenull's Promise-aware functions share names across these forms, so you do not need separate `map` and `mapAsync` functions.

## Use map for synchronous transformations

The callback passed to `map` transforms a value synchronously. If the input is a Promise of an Option, `map` waits for that input through its own Promise handling before invoking the synchronous callback.

Use `andThen` when the next step returns an Option or a Promise of an Option. This includes asynchronous work wrapped with `fn`:

```ts
import { Option } from "byenull";

declare function loadDisplayName(id: string): Promise<string | null>;
const displayNameFor = Option.fn(loadDisplayName);

const pending = Option.pipe(
  Option.some("u1"),
  Option.andThen(displayNameFor),
  Option.map((name) => name.trim()),
);

const displayName: Option.Option<string> = await pending;
```

`displayNameFor` returns an `OptionAsync<string>`. `andThen` uses that Option as the next pipeline value. The later `map` callback still receives a resolved `string` and runs only for `Some`.

Do not use an async Option-returning callback as a `map` mapper. `map` does not flatten that callback's result into the next Option. `andThen` is the operation for that job.

## unwrap distributes over a mixed union

`unwrap` has a different return-type rule, depending on what the input type is.

For a numeric Option and a numeric fallback, a synchronous input returns `number`, an asynchronous input returns `Promise<number>`, and a mixed input returns `number | Promise<number>`:

```ts
import { Option } from "byenull";

declare const mixed: Option.OptionMaybeAsync<number>;

const value: number | Promise<number> = Option.unwrap(0)(mixed);
const settledValue: number = await value;
```

The runtime behavior matches both members of that return type. A plain Option produces the value or fallback immediately. A Promise input produces a Promise for the value or fallback.

// TODO: Rewrite this to illustrate Pipeline coloring when introducing async steps
## The shared API has visible type costs

A separate set of async combinators could give each function a shorter signature. byenull instead uses conditional types such as `OptionFor`, which are harder to read in editor tooltips and error messages. Mixed-union inputs need particular care because `OptionFor` can declare a Promise even when one call returns synchronously.

Changing an `andThen` callback from an `Option` to an `OptionAsync` also changes the inferred result of later combinators. Existing pipeline steps can remain unchanged, but callers must await the eventual result when they need a resolved Option.

Use `map` only for synchronous value transformations. Use `andThen` or `orElse` for Option-returning work that may be asynchronous. Await at the point where your code needs one resolved type, especially when the input is `OptionMaybeAsync` rather than definitely synchronous or definitely asynchronous.
