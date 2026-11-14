---
description: Convert between byenull Options and byethrow Results with toResult and fromResult, including asynchronous values and error handling.
---

# Converting to Results

An `Option` represents absence without an error. A `Result` from `@praha/byethrow` represents success or failure. Convert between them when the meaning of a missing value changes.

## Converting an Option to a Result

`toResult(error)` supplies the failure value for a `None`. A `Some` becomes a `Success` with the same value:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const present: Option.Option<User> = Option.some({ id: "u1", name: "Alice" });
const missing: Option.Option<User> = Option.none();

const success = Option.pipe(
  present,
  Option.toResult(new Error("User not found")),
);
// { type: 'Success', value: { id: 'u1', name: 'Alice' } }

const failure = Option.pipe(
  missing,
  Option.toResult(new Error("User not found")),
);
// { type: 'Failure', error: Error('User not found') }
```

The Option does not contain an error, so the caller must provide one at the conversion point.

## Continuing with Result combinators

Once absence becomes a failure, continue with byethrow's combinators. A missing user skips the following `Result.map`:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };

const users: User[] = [{ id: "u1", name: "Alice" }];
const findUser = Option.fn((id: string) => users.find((user) => user.id === id));

const displayName = (id: string) =>
  Result.pipe(
    Option.pipe(
      findUser(id),
      Option.toResult(new Error(`User not found: ${id}`)),
    ),
    Result.map((user) => user.name),
  );

displayName("u1"); // { type: 'Success', value: 'Alice' }
displayName("u404"); // { type: 'Failure', error: Error('User not found: u404') }
```

## Converting a Result to an Option

`fromResult` converts a `Success` to a `Some` and a `Failure` to a `None`. It discards the Failure error:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

const some = Option.fromResult(Result.succeed(2));
// { type: 'Some', value: 2 }

const none = Option.fromResult(Result.fail(new Error("Request failed")));
// { type: 'None' }, the error is discarded
```

Use this direction only when the caller no longer needs the failure details.

## Converting asynchronous values

Both converters accept Promise-based inputs. `toResult` returns a `ResultAsync` for an `OptionAsync`, and `fromResult` returns an `OptionAsync` for a `ResultAsync`:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

const empty: Option.Option<number> = Option.none();

const result = await Option.pipe(
  Promise.resolve(empty),
  Option.toResult("No value"),
);
// { type: 'Failure', error: 'No value' }

const option = await Option.fromResult(
  Promise.resolve(Result.fail("No value")),
);
// { type: 'None' }
```

Convert where absence changes meaning. [Option vs Result](../../explanation/option-vs-result) explains how to choose the type, and [How to convert between Option and Result](../../how-to/converting-between-option-and-result) collects boundary patterns.
