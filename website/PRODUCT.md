# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is TypeScript-first developers handling values that may legitimately be absent in existing applications. JavaScript remains supported. Existing `byethrow` users are a natural audience, but `byenull` is also designed for standalone use.

Typical situations include collection and map lookups, cache reads, optional configuration and feature flags, DOM queries, and API responses with missing fields or records. Developers encounter the product while evaluating an Option library, learning its pipeline model, integrating it into existing code, testing Option values, or consulting exact API behavior.

## Product Purpose

`byenull` is a lightweight, tree-shakable Option type library for JavaScript and TypeScript. It represents absence explicitly as `Some` or `None`, making presence part of the type and allowing lookups and transformations to compose without repeated nullish checks. The accompanying `byenull-testing` package provides Option matchers for Vitest and Jest.

The documentation website exists to help developers evaluate the library, reach a working Option pipeline, and understand exact behavior. Durable success priorities are:

- fast, confident adoption through accurate, type-checked examples;
- a trusted reference for concepts, edge cases, sync/async behavior, and generated API details;
- a coherent experience for developers pairing `byenull` with `byethrow`.

## Positioning

`byenull` handles presence and absence without requiring a larger functional-programming runtime or paradigm. Its distinguishing combination is plain-object Options, standalone tree-shakable functions, precise type inference, one Promise-aware API for sync and async work, and data-last combinators composed with `pipe`.

It deliberately follows `@praha/byethrow`'s API design and provides `toResult` and `fromResult` at the semantic boundary between absence and failure. It is a companion to `byethrow`, not a replacement for Result-based error handling and not a clone of its error machinery.

## Operating Context

The repository is a pnpm monorepo containing the core `byenull` package, `byenull-testing`, and this Rspress documentation website. The core and testing packages must be built before running the website locally because documentation examples type-check against the real packages.

The documentation follows Diátaxis: getting-started material, a progressive tutorial, task-oriented how-to guides, conceptual explanation, and generated API reference. Twoslash checks code samples during development and builds; TypeDoc regenerates the API reference from source. The site is English-language, links back to GitHub for source and edits, and supports clean URLs and generated LLM documentation.

Developers can introduce Options alongside existing null-based code. `Option` and `O` are two namespaces for the same implementation, supporting explicit and compact pipeline styles without different behavior.

## Capabilities and Constraints

- An Option is a plain serializable object: `{ type: "Some", value }` or `{ type: "None" }`; there are no classes, private state, or prototype methods.
- Every operation is an independent export for tree shaking. Transformers use curried, data-last functions intended for top-to-bottom `pipe` pipelines.
- `some`, `fn`, and `maybe` normalize nullish inputs or return values to `None`; a `Some` always contains a non-nullish value.
- Transformers accept either `Option<T>` or `Promise<Option<T>>` and preserve asynchronousness in their result types. One async step widens the pipeline, which can be awaited once at the end.
- `fn` and `maybe` convert asynchronous rejections to `None` but allow synchronous throws to propagate. Option absence must not silently erase programming errors.
- Option and Result remain semantically distinct. `toResult` requires the caller to supply an error because `None` has no error channel; `fromResult` intentionally discards failure information.
- `byenull` remains small and standalone, with no larger functional runtime to adopt. `byenull-testing` supplies typed `toBeSome` and `toBeNone` matchers for Vitest and Jest.
- The packages use the MIT license. Documentation code samples and generated API pages must stay aligned with the real source rather than becoming an independent description of behavior.

## Brand Commitments

The product name is the lowercase `byenull`. Public terminology distinguishes **absence** (Option) from **failure** (Result), and uses the established `Option`, `Some`, `None`, `map`, `andThen`, `orElse`, `unwrap`, and `pipe` vocabulary. Compatibility with the `byethrow` mental model is an intentional product commitment.

## Evidence on Hand

- Core implementation and tests: `packages/byenull/src/`
- Testing matchers and usage documentation: `packages/testing/`
- Type-checked guides and worked examples: `website/docs/guide/`
- Source-generated API reference: `website/docs/api/`, produced by `website/plugins/typedoc/`
- Real package metadata, installation commands, and examples: root `README.md` and package manifests
- Twoslash and TypeDoc integration: `website/rspress.config.ts`

No customer proof, testimonials, case studies, measured performance claims, or bundle-size benchmarks were found. Future product content must not invent them.

## Product Principles

1. **Keep absence and failure distinct.** Model legitimate absence with Option and move to Result only where the domain meaning changes.
2. **Minimize the adoption surface.** Prefer plain data, standalone functions, and precise types over classes, a runtime, or a broader paradigm.
3. **Maintain one coherent mental model.** Sync and async operations share an API, and the `byethrow` pairing should feel like one toolkit.
4. **Make examples executable evidence.** Keep documentation close to source, type-check samples against real packages, and generate API reference behavior from implementation.
5. **Optimize for confident evaluation and lasting reference value.** Teach the first useful pipeline clearly without sacrificing exact edge-case and semantic documentation.
