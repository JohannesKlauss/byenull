---
description: "How Promise-aware Option operations dispatch at runtime, how OptionFor types mixed unions, and why unwrap can return either a value or a Promise."
---

# Sync and async Options

An `OptionAsync<T>` is a `Promise<Option<T>>`. An `OptionMaybeAsync<T>` is the union `Option<T> | Promise<Option<T>>`. byenull's Promise-aware functions share names across these forms, so you do not need separate `map` and `mapAsync` functions.

The shared names do not erase the differences in their return types. Conditional types can also make a function's static result more conservative than the value produced by one particular call.

## Promise handling is limited to specific operations

`map`, `andThen`, `orElse`, `unwrap`, `toResult`, and `fromResult` handle Promise-based inputs. At runtime, each checks the immediate input. A plain Option or Result is processed immediately. A Promise input is chained with `.then`, and the result is a Promise.

The constructors and guards do not generally resolve Promises. For example, `some(promise)` creates an Option containing the Promise as its payload. `isSome` and `isNone` inspect only the immediate Option passed to them. `fn` and `maybe` have their own Promise handling for callback results, including rejection conversion, as described in [Design principles](./design-principles#synchronous-throws-and-promise-rejections-differ).

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

## OptionFor gives a Promise-containing union an async result

Combinators such as `map`, `andThen`, and `orElse` use `OptionFor<O, T>` to select their return type. If `O` contains no Promise, the result is `Option<T>`. If any member of `O` contains a Promise type, the result is `OptionAsync<T>`, which is Promise-only:

```ts
import { Option } from "byenull";

type SyncResult = Option.OptionFor<Option.Option<number>, string>;
// Option.Option<string>

type AsyncResult = Option.OptionFor<Option.OptionAsync<number>, string>;
// Option.OptionAsync<string>

type MixedResult = Option.OptionFor<Option.OptionMaybeAsync<number>, string>;
// Option.OptionAsync<string>, not Option.Option<string> | Option.OptionAsync<string>
```

`andThen` and `orElse` include both the incoming Option type and the callback's return type in this decision. One possible asynchronous branch therefore makes the static result asynchronous.

For a mixed-union value, this type rule is conservative. Runtime dispatch still examines the actual value:

```ts
import { Option } from "byenull";

declare const mixed: Option.OptionMaybeAsync<number>;

const mapped: Option.OptionAsync<number> = Option.map((value: number) => value + 1)(mixed);
```

If `mixed` contains a plain `Some(1)` at runtime, this call can return a plain `Some(2)` immediately. Its declared type is still `Promise<Option<number>>` because the input type also permits a Promise. Follow the static type at call sites. An `await` inside an async function normalizes either runtime outcome to an `Option<number>`.

## unwrap distributes over a mixed union

`unwrap` has a different return-type rule. Its conditional type distributes over the input union instead of collapsing every Promise-containing union to Promise-only.

For a numeric Option and a numeric fallback, a synchronous input returns `number`, an asynchronous input returns `Promise<number>`, and a mixed input returns `number | Promise<number>`:

```ts
import { Option } from "byenull";

declare const mixed: Option.OptionMaybeAsync<number>;

const value: number | Promise<number> = Option.unwrap(0)(mixed);
const settledValue: number = await value;
```

The runtime behavior matches both members of that return type. A plain Option produces the value or fallback immediately. A Promise input produces a Promise for the value or fallback.

## The shared API has visible type costs

A separate set of async combinators could give each function a shorter signature. byenull instead uses conditional types such as `OptionFor`, which are harder to read in editor tooltips and error messages. Mixed-union inputs need particular care because `OptionFor` can declare a Promise even when one call returns synchronously.

Changing an `andThen` callback from an `Option` to an `OptionAsync` also changes the inferred result of later combinators. Existing pipeline steps can remain unchanged, but callers must await the eventual result when they need a resolved Option.

Use `map` only for synchronous value transformations. Use `andThen` or `orElse` for Option-returning work that may be asynchronous. Await at the point where your code needs one resolved type, especially when the input is `OptionMaybeAsync` rather than definitely synchronous or definitely asynchronous.
