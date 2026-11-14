---
description: "Why byenull uses plain objects, data-last functions, nullish-normalizing constructors, two namespace aliases, and shared sync and async combinators."
---

# Design principles

byenull uses plain data and function pipelines. Those choices affect how you compose code, validate values, and handle asynchronous work. They also have costs that are worth understanding before you adopt the API.

## Options are plain objects

An `Option` is either `{ type: "Some", value }` or `{ type: "None" }`. It has no class instance, private state, or prototype methods. You can inspect it in a debugger and compare it with ordinary object assertions. `JSON.stringify` can serialize the object when its payload is also serializable.

The cost is that values do not have methods such as `option.map(...)`. You import the functions you need and use type guards or pipelines. This keeps the data independent of the operations performed on it.

## Constructors normalize nullish values

`some(null)` and `some(undefined)` return `None`. The `fn` and `maybe` creators apply the same rule to nullish callback results. Code that consumes these results does not need a second check for a nullish payload.

Normalization is a constructor rule. It is not a guarantee about every object with an Option shape. `Some<T>` does not constrain `T`, and `isOption` checks the object's fields without inspecting the payload:

```ts
import { Option } from "byenull";

const handBuilt: Option.Some<null> = { type: "Some", value: null };
const recognized: boolean = Option.isOption(handBuilt);
// recognized is true, even though the value is null
```

Prefer the creators when you want nullish normalization. If an Option-shaped object comes from an untrusted source, validate its `Some.value` separately before treating it as non-nullish.

## Functions take data last

A call such as `Option.map(fn)` returns a function that waits for an Option. This makes the same function usable as a step in `Option.pipe`:

```ts
import { Option } from "byenull";

const doubled = Option.map((value: number) => value * 2)(Option.some(21));

const domain = Option.pipe(
  Option.some("alice@example.com"),
  Option.map((address) => address.slice(address.indexOf("@") + 1)),
  Option.unwrap("unknown"),
);
// domain is a string
```

A single transformation has an extra call layer, as `doubled` shows. A pipeline lists later steps in execution order, which avoids nesting a call around each preceding result. byenull uses this convention throughout instead of supporting both data-first and data-last variants.

## Synchronous throws and Promise rejections differ

`fn` and `maybe` turn a nullish callback result into `None`. When the callback returns a Promise, they also turn a rejection into `None`. A synchronous throw before the callback returns a Promise propagates to the caller.

A throw inside an `async` function becomes a Promise rejection, so `fn` and `maybe` convert it to `None`. This distinction follows JavaScript's execution rules. It is not based on the kind of error thrown.

Converting a rejection to `None` discards its reason. Use a `Result` when the caller needs the rejection value for logging, recovery, or a user-facing message.

## Promise support belongs to specific operations

`map`, `andThen`, `orElse`, `unwrap`, `toResult`, and `fromResult` handle Promise-based inputs according to their signatures. Their synchronous and asynchronous paths share the same function names. See [Sync and async Options](./sync-and-async) for the runtime and type rules.

The constructors and guards do not generally resolve Promises. Passing a Promise to `some` wraps the Promise as a payload. `none` takes no input, and the guards inspect the immediate value they receive. `fn` and `maybe` are a separate case because they adapt Promises returned by their callbacks.

## The package root exports two namespace aliases

The package root exports the `Option` and `O` namespaces. They expose the same functions and types, with `O` providing a shorter name. There is no behavioral difference between them.

Use `Option` where the full name makes call sites clearer. Use `O` if your project prefers shorter pipelines. Pick one convention per module so readers do not have to switch names without a reason.

## byenull follows byethrow where their behavior overlaps

byenull uses the namespace style, curried data-last functions, `pipe`, and Promise-aware combinators from [@praha/byethrow](https://praha-inc.github.io/byethrow/). Code that uses both libraries can keep the same pipeline structure.

The two types still carry different information. `None` has no error field, while a byethrow `Failure` carries an error. `toResult` therefore requires an error for the empty case, and `fromResult` discards a failure's error. The shared conventions do not hide that difference.
