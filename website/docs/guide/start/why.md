---
description: Why use an Option type instead of nullish checks, and why byenull in particular. Type-safe absence handling with a byethrow-compatible API and no functional programming overhead.
---

# Why byenull?

This page explains the problems an `Option` type solves, and why byenull in particular is a good fit for everyday TypeScript projects.

## The problem with nullish values

`null` and `undefined` are the "billion-dollar mistake" JavaScript inherited. TypeScript's `strictNullChecks` catches many mistakes at compile time, but three problems remain:

- **Repeated checking.** A nullable value carries its ambiguity everywhere. Every consumer re-checks, and every `?.` and `??` is one more chance to forget or to treat different kinds of "missing" identically.
- **Unexplained absence.** `null` says nothing about _why_ the value is missing, whether it was not loaded, not found, or not applicable. Downstream code either guesses or ignores the difference.
- **Poor composition.** Chains of nullable lookups degenerate into nested conditionals or long `?.` trains that silently produce `undefined` somewhere deep.

An `Option` type solves these by treating absence as an ordinary value:

- **Checked once.** The lookup returns `Some` or `None`, and the type carries which one you have.
- **Composable.** `map`, `andThen`, and `orElse` work on the whole Option, so absence short-circuits through the pipeline instead of being re-tested at every step.
- **Serializable and debuggable.** An Option is a plain object, so you can log it, diff it, assert on it.

See [Option vs null and undefined](../explanation/option-vs-null) for a deeper treatment.

## Why byenull over other libraries?

There are several excellent Option and functional libraries in the TypeScript ecosystem. byenull aims for the sweet spot between a minimal utility and a full functional programming framework.

### Compared to plain nullish handling

Everything byenull does is _possible_ with `?.`, `??`, and discipline, in the same sense that error handling is possible with `try/catch` and discipline. byenull's value is that the discipline becomes the compiler's job: the pipeline either has a value or it doesn't, and the types say which.

### Compared to Effect and fp-ts

Effect and fp-ts provide `Option` types inside a larger functional runtime, together with a big vocabulary of concepts. byenull only deals with presence and absence: plain objects, standalone functions, no runtime to adopt, no paradigm to learn.

### Compared to byethrow

byethrow itself is the natural first choice when your problem is _failure_, operations that error with information you must handle. byenull does not replace it. It covers the other half: values that are simply _not there_. The two libraries share an API design, so using both feels like one toolkit, and `toResult` / `fromResult` convert between them at the boundary.

## Designed for real-world use

- **Team-friendly.** Adopt it one lookup at a time. It works alongside existing code that returns `null`.
- **TypeScript-first.** Value types are inferred through every step of a pipeline.
- **Lightweight.** A small runtime with full tree-shaking support.
- **Predictable.** The naming scheme matches byethrow, so `map`, `andThen`, `orElse`, and `unwrap` are easy to remember.
- **Well-equipped.** [Test matchers](../how-to/testing-options) and [generated API documentation](/api/modules/Option) round out the workflow.

## Next steps

- [Quick start](./quick): install byenull and run the core workflow.
