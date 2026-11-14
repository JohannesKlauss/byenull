---
description: Decide when Option pipelines are useful, what byenull leaves explicit, and when a @praha/byethrow Result is the better return type.
---

# Why byenull?

TypeScript's `strictNullChecks` already prevents direct property access on a nullable value. Keep using `?.` and `??` for a local property or a single default. They are direct and need no wrapper.

byenull helps when absence passes through several operations. A lookup can return `Option<T>`, after which `map` and `andThen` run their callbacks only for Some. None reaches the end without invoking later value-side work. The return type preserves the possibility of absence throughout the pipeline.

## Keep the decision at the boundary

An Option pipeline still needs an exit. Use `Option.isSome` or `Option.isNone` when the two cases need different behavior. Use `Option.unwrap(defaultValue)` when a default is enough. `unwrap` returns the Some value or the default, and never throws for None.

This moves repeated intermediate nullish handling into combinators. It does not remove the need for every null check. Input validation, API boundaries, and code that keeps raw nullable values still need appropriate checks.

## Know what None leaves out

None has no error or explanation. byenull also normalizes `null` and `undefined` to the same value, so it cannot preserve a distinction between them. Keep a nullable value or define a more specific union when that distinction matters.

`Option.fn` and `Option.maybe` convert Promise rejection to None. This discards the rejection reason. They do not catch a synchronous throw, which continues to propagate. Use a Result when callers need either kind of failure information.

These trade-offs make Option a poor substitute for general error handling. They also keep its data shape small: Some contains a `value`, while None contains only its `type`. Both are plain objects that can be logged, compared, and serialized.

## Pair absence with failure

byenull complements `@praha/byethrow`; it is not another Result library. Return an Option when "not found" or "not set" needs no error. Return a Result when parsing fails, a request returns an error that the caller must inspect, or a business rule needs a typed reason.

At a boundary between those models, `Option.toResult(error)` supplies the Failure error for None. `Option.fromResult` maps Failure to None and discards its error; this may lose useful information and should be a deliberate decision.

Both libraries use namespaces and familiar operation names such as `map`, `andThen`, `orElse`, and `unwrap`. You can introduce byenull around one lookup without rewriting unrelated code that uses nullish values or Results.

The [quick start](./quick.md) shows where to construct, transform, guard, and convert Options.
