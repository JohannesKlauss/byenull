---
description: Extract a plain value from an Option with unwrap, provide a default for None, and unwrap asynchronous Options at application boundaries.
---

# Unwrapping options

Code outside an Option pipeline usually needs a plain value. `unwrap` returns the value inside a `Some` or a supplied default for a `None`.

## Extracting values with `unwrap`

Pass the default to `unwrap`, then use it as the last step in a pipeline:

```ts
import { Option } from "byenull";

const value = Option.pipe(Option.some(42), Option.unwrap(0));
// 42

const empty: Option.Option<number> = Option.none();
const fallback = Option.pipe(empty, Option.unwrap(0));
// 0
```

A `None` never causes `unwrap` to throw. It always returns the default.

## Choosing the default type

The default must be assignable to the Option's value type, or be `null` or `undefined`:

```ts
import { Option } from "byenull";

const option = Option.some(2);

const value = Option.pipe(option, Option.unwrap(0));
// number

const nullable = Option.pipe(option, Option.unwrap(null));
// number | null

const optional = Option.pipe(option, Option.unwrap(undefined));
// number | undefined
```

TypeScript rejects an incompatible non-nullish default. Nullish defaults are useful when the calling code already accepts a nullable or optional result.

## Unwrapping in a pipeline

Keep transformations inside the pipeline, then extract the value once:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const users: User[] = [{ id: "u1", name: "Alice" }];
const findUser = Option.fn((id: string) => users.find((user) => user.id === id));

const displayName = (id: string): string =>
  Option.pipe(
    findUser(id),
    Option.map((user) => user.name),
    Option.unwrap("Guest"),
  );

displayName("u1"); // 'Alice'
displayName("u404"); // 'Guest'
```

After `unwrap`, the result is a plain `string`, so later Option combinators cannot be applied to it.

## Unwrapping asynchronous Options

`unwrap` accepts an `OptionAsync` and returns a Promise of the value or default:

```ts
import { Option } from "byenull";

const value = await Option.pipe(
  Promise.resolve(Option.some(21)),
  Option.map((value) => value * 2),
  Option.unwrap(0),
);
// 42
```

## Where to unwrap

Unwrap at application boundaries, such as when rendering a response or returning a value from a CLI command. Keep the Option while more `map`, `andThen`, or `orElse` steps need to run.

A default says that absence is acceptable. If a missing value must be handled as an error, [convert the Option to a Result](./converting-to-results) instead of hiding it with a default. [Option vs null and undefined](../../explanation/option-vs-nullish) discusses when plain nullish handling is clearer.
