---
description: "The decisions behind byenull's shape: plain objects instead of classes, data-last curried functions composed with pipe, nullish normalization in some, and why fn and maybe do not catch synchronous throws."
---

# Design principles

byenull looks the way it does because of a handful of small, deliberate decisions. This page states them and the reasoning behind each, so the trade-offs are visible rather than buried in the source.

## Plain objects, no classes

An `Option` is a plain object with a `type` property, `{ type: 'Some', value }` or `{ type: 'None' }`, not a class instance. Everything follows from that: an Option can be logged and inspected, compared with `toEqual` in tests, serialized to JSON, and constructed by hand if you ever need to. Nothing is hidden behind private state or prototype methods, and tree-shaking works per-function because the functions do not live on the value. A class-based design would move the API onto instances, which bundlers prune less aggressively and which drags the whole class into every import.

## Data-last functions, composed with `pipe`

Transformers are curried in the data-last order: `map(fn)` returns a function waiting for the Option. The payoff is `pipe`. A pipeline reads top-to-bottom in execution order, which byethrow demonstrated is the most readable way to express a chain. The cost is that a single transformation reads "inside-out" (`Option.map(f)(option)`), so `pipe` is the intended home for these functions and the documentation treats it that way.

## `some()` normalizes nullish values

`some(null)` and `some(undefined)` return a `None`, and the type signature removes nullish types from the value. This maintains a single invariant: _a `Some` always holds a non-nullish value_. Without it, every consumer of an Option would have to re-check for null inside the `Some`, exactly the checking the Option exists to remove. The normalization is deliberately at the constructor, not spread across every transformer: values enter an Option once, through `some`, `fn`, or `maybe`, and are trustworthy from there on.

## `fn` and `maybe` catch rejections, not throws

The wrappers convert a nullish _return value_ into a `None`, and on the asynchronous path a rejected Promise into a `None`. A synchronous throw, however, propagates to the caller. The reasoning: a nullish return is a _statement about the value_ ("there isn't one"), which is Option's domain. A synchronous throw is usually a programming error (or a thrown value that a caller upstream wants to catch), and silently converting it to `None` would swallow information. That is the same argument byethrow makes for why `fn` there converts throws into typed Failures rather than discarding them. When an operation genuinely throws in your domain, wrap the throw yourself or model it as a Result.

## Two namespaces, one implementation

`Option` and `O` are the same module re-exported twice. They exist because pipelines read either explicit or compact, and different codebases legitimately want different registers, not because the functions differ. Both tree-shake identically, since each namespace member is an independent export.

## A companion, not a clone

byenull follows @praha/byethrow's API design on purpose: namespaces, curried combinators, `pipe`, the sync/async unification. A developer who knows one library can use the other without learning a new mental model, and the interop functions (`toResult`, `fromResult`) assume both vocabularies. Where the two domains differ, the API diverges rather than pretending the shapes match: an Option has no error channel, so its `unwrap` returns a fallback rather than throwing, and its conversion to Result requires you to supply the error yourself.
