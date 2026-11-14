---
description: "How byenull unifies synchronous and asynchronous Options: OptionMaybeAsync, the isPromise dispatch, and the OptionFor/HasPromise type machinery behind it."
---

# The sync/async model

Most Option libraries have two of everything: `map` for Options, `mapAsync` for Promises of Options. byenull has one of everything. Why does that work, and what is going on underneath?

## One type, one API

Every transformer accepts an `OptionMaybeAsync<T>`, either an `Option<T>` or a `Promise<Option<T>>`, and returns whichever of the two the input turns out to be. At runtime the choice is a single check: the internal `isPromise` helper tests whether the value has `then`/`catch`, applies the transformation directly if not, and otherwise attaches it with `.then`:

```ts
// @noErrors
// The shape of every transformer in byenull (simplified):
const apply = (o: Option<T>) => (isNone(o) ? o : fn(o.value));
return isPromise(option) ? option.then(apply) : apply(option);
```

There is no separate async API to learn, and no way for the two halves to drift apart. An `andThen` step that is synchronous today stays valid the day its inner function becomes asynchronous. The surrounding pipeline does not change; only its result widens to an `OptionAsync`.

## How the types keep up

The runtime dispatch needs a type-level mirror, or every transformer would have to return a loose union. That mirror is `OptionFor<O, T>`: it resolves to `Option<T>` when the input type `O` contains no Promise, and `OptionAsync<T>` when it does. The Promise detection itself is `HasPromise<T>`, a conditional that asks whether `Promise<any>` would be assignable to `T`. It is true for `Promise<Option<string>>` and for any union that includes a Promise, and false for plain Options.

Chained steps union their input types, `OptionFor<O1 | ReturnType<F>, ...>`, so one asynchronous step anywhere in a chain makes the final type asynchronous. This is why the rule of thumb in the guides is "await the result once at the end": the type system already tracks whether you need to.

## What it costs

The price is visible in the signature of every curried function: generic types like `OptionFor<O1 | ReturnType<F>, InferSome<F>>` are harder to read in an editor tooltip than a plain `Option<T>` would be. That is the trade: a slightly heavier type surface in exchange for never writing or maintaining parallel sync/async functions.

The unification also means synchronicity is decided by the data, not by which function you called. If a value's type is `OptionMaybeAsync<T>`, sometimes resolved and sometimes a Promise, a transformer applied to it returns `Option<T> | Promise<Option<T>>`, and only an `await`, or knowledge of the specific value, collapses it. That is honest: the ambiguity was in the value all along.

## Why not a separate async Option type

Some libraries make the async case a distinct type with its own combinators. That buys precise signatures, but it splits every pipeline, tutorial, and test into sync and async variants, and it forces `await`-style adapters at every seam between them. byenull's bet, the same bet byethrow makes with `ResultMaybeAsync`, is that one API with Promise-aware types is less total complexity than two APIs with clean ones.
