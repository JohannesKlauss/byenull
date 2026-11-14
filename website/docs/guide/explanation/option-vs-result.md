---
description: "Absence versus failure: why byenull and byethrow are separate libraries, when an Option is the right model and when a Result is, and how the two convert at boundaries."
---

# Option vs Result

byenull and [@praha/byethrow](https://praha-inc.github.io/byethrow/) cover two different meanings of "you didn't get a value". Why two libraries, and which one belongs where?

## Absence versus failure

An **Option** models _absence_: the value you asked for may not be there, and that is not an error. `find` not finding a user, a `Map` not containing a key, a DOM query matching nothing: these are ordinary outcomes of asking a question whose answer can legitimately be "no".

A **Result** models _failure_: the operation tried to produce a value and could not. The failure carries information, such as an error object, a message, or a cause, that someone is expected to handle or report.

The distinction is semantic, not mechanical. The same lookup can be either, depending on your domain: "user not found" is absence in a search box and failure in an authentication flow. Choosing the type forces the question, which is the point.

## What each type knows

An `Option` is `{ type: 'Some', value } | { type: 'None' }`, two variants, one of which carries the value. That minimalism is its strength: it is tiny, serializable, and says exactly one thing.

A `Result` is `{ type: 'Success', value } | { type: 'Failure', error }`, and the failure variant carries the error. That extra channel is what lets byethrow build error-heavy workflows: typed error unions, recovery with `orElse`, aggregation of multiple failures.

Because `None` carries nothing, converting an Option to a Result requires you to _supply_ the error (`toResult(err)`), and converting a Result to an Option _discards_ it (`fromResult`). The conversions are lossy by design. They are the places where your code decides that a failure is really just absence, or that an absence deserves to be treated as a failure. That decision is yours, not the library's.

## Why two libraries

The two types share almost nothing at runtime: an Option has no error to inspect, a Result has no "just checking" use case. Folding them into one library would either bloat the Option API with error machinery it cannot use, or starve the Result API of the error tools it needs. Keeping them separate keeps both small, and lets you depend on only the half you need.

They do share a _shape_. byenull mirrors byethrow's API design deliberately: the same namespace style, the same curried data-last functions, the same `pipe`, the same sync/async unification. Switching between them, or using them side by side, feels like one toolkit. `toResult` and `fromResult` are the bridges.

## When to reach for which

Use an **Option** when "not there" is a valid answer and nobody needs to know why: lookups, caches, optional settings, nullable fields from APIs, presence checks before acting.

Use a **Result** when the absence is a failure someone must handle: parsing and validation, I/O, operations whose errors feed user-facing messages, logging, or retries.

When a flow starts as a lookup but escalates, with "config key missing" becoming "cannot start the server", do the lookup with an Option and convert to a Result at the point where it becomes an error. Convert where the meaning changes, not everywhere.

## Prior art

The split is a long-standing functional-programming convention: Rust has both `Option` and `Result`, Scala has `Option` and `Try`, and fp-ts has `Option` and `Either`. Libraries that use a single type for both exist, but they tend to overload one variant, usually the "none", with error data it was never meant to hold, which is exactly the ambiguity the two-type split exists to avoid.
