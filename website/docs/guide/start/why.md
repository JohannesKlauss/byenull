---
description: Decide when Option pipelines are useful, what byenull leaves explicit, and when a @praha/byethrow Result is the better return type.
---

# Why byenull?

TypeScript's `strictNullChecks` configuration already prevents direct property access on a nullable value. Keep using `?.` and `??` for a local property or a single default. Byenull shines when you have more complex operations that operate on values that might be missing.

## The problem with `null` and `undefined`

JavaScript has a lot of historical baggage. Among that baggage we find two ways to declare the absence of a value and messy identity checks.

Most JavaScript developers treat `null`, `undefined` and `field?` as the same thing, when in fact they aren't:

```ts
null == undefined // true
null === undefined // false
typeof null // 'object'
typeof undefined // 'undefined'
```

Defining complex structures therefore can get very messy quite easily.

```ts
// @errors: 2741
type User = { name: string | null, avatar?: string | null, age: number | undefined }

// These are all valid shapes of a User
const u1: User = {name: "John Doe", age: undefined}
const u2: User = {name: "Jane Doe", avatar: null, age: undefined}
const u3: User = {name: null, avatar: undefined, age: undefined}
const u4: User = {name: null, age: undefined}

// This shape is rejected: 'age' is required
const u5: User = {name: "John Doe"}
```

With `undefined`, `null` and `?` in the mix, the typechecker allows multiple shapes of a user object.

This can lead to a lot of subtle bugs, incoherent value absence handling and mapping issues, especially when talking to external APIs, i.e. your database, where undefined is not a concept, `null` might mean something different and missing object keys (because they defined with `fieldName?`) cause errors in queries.

Furthermore, if you declare a variable `var a` and don't explicitly set a value, it's initial value is `undefined`.

### byenull makes absence explicit

```ts
import { O } from "byenull";

type User = { name: O.Option<string>, avatar: O.Option<string>, age: O.Option<number> }

const u1: User = {name: O.some("John Doe"), avatar: O.none(), age: O.none()}
const u2: User = {name: O.none(), avatar: O.none(), age: O.none()}
```

`Option` tells the compiler explicitly that a value might be absent in one coherent way. Setting all fields is required reducing the amount of allowed shapes to 1.

Keeping your business logic uniform and reducing the number of ways to do things is important for writing maintainable code, no matter if it is written by humans or agents. byenull gives you one uniform toolset to handle the absence of a value.

## `Option` is not for error handling

`None` has no error or explanation. byenull also normalizes both `null` and `undefined` to None, so it cannot preserve a distinction between them. Keep a nullable value or define a more specific union when that distinction matters (i.e. forms in HTML produce behave differently on `undefined` and `null`).

Most importantly `None` cannot act as a error handling solution, since it does not hold any information on why a value might be absent.

### Pair absence with failure

byenull is designed to work well with the excellent [`@praha/byethrow`](https://praha-inc.github.io/byethrow/) library, which provides a `Result<T, E>` type to make failures explicit. Return an _Option_ when "not found" or "not set" needs no error. Return a _Result_ when parsing fails, a request returns an error that the caller must inspect, or a business rule needs a typed failure reason.

Both libraries use namespaces and familiar operation names such as `map`, `andThen`, `orElse`, and `unwrap`, so if you already use one the two, you'll feel right at home with the other library.

## Why byenull over other libraries?

There are several Option libraries in the TypeScript ecosystem.
byenull aims for the sweet spot between a minimal utility and a full functional programming framework.

### Compared to other libraries

Most Option libraries are direct ports from Rusts `Option<T>` enum. These libraries often use classes for the Option type and their ergonomics falls apart when mixing synchronous and async operations.
byenull makes different trade-offs:

- **Plain objects**: A byenull `Option` is a plain `{ type, value }` or `{ type }` object that can be logged, serialized, and compared as it is.
- **Standalone functions**: Operations are independent functions combined with `pipe`, so unused ones are removed by tree-shaking.
- **One API for sync and async**: The same functions work with both `Option` and `Promise<Option>`, so you never need to convert between two kinds of results.
- **Interop with byethrow**: Functions such as `fromResult` and `toResult` allow for easy interop between the Result and Option type.

### Compared to Effect and fp-ts

Effect and fp-ts are extremely powerful, but they come with their own runtime model and a large vocabulary of functional programming concepts.
byenull only deals with some value or no value, so your team can adopt it without learning a new programming paradigm.

## Designed for Real-World Use

- **Team-friendly**: Adopt it one function at a time. It works alongside existing code that throws.
- **TypeScript-first**: Some types are inferred through every step of a pipeline.
- **Lightweight**: A small runtime with full tree-shaking support.
- **Predictable**: A consistent naming scheme (`map`, `andThen` / `orElse`, and so on) keeps the API easy to remember.
- **Well-equipped**: A linter plugin, test matchers, and documentation for AI assistants help the whole team follow the same patterns.