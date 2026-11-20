---
description: "How to cross the boundary between byenull Options and @praha/byethrow Results: convert absence into a Failure with toResult, and drop the error with fromResult."
---

# How to convert between Option and Result

To move a value between code that treats "no value" as absence (byenull) and code that treats it as failure ([@praha/byethrow](https://praha-inc.github.io/byethrow/)), convert at the boundary. `toResult` turns a `None` into a `Failure` you define, while `fromResult` turns any `Failure` into a `None`.

## Convert an Option into a Result

To hand an `Option` to Result-based code, convert it with `toResult` and provide the error for the `None` case:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
const users: User[] = [{ id: "u1", name: "Alice" }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const result = Option.pipe(findUser("u404", users), Option.toResult(new Error("User not found")));
// { type: 'Failure', error: Error('User not found') }
```

If the error needs context from the call site, build it before converting:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
declare const option: Option.Option<User>;

const result = Option.pipe(option, Option.toResult(new Error("User not found for id u404")));
```

## Convert a Result into an Option

To get an `Option` back from a `Result`, use `fromResult`. A `Failure` becomes a plain `None`, and the error is discarded:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
declare const result: Result.Result<User, Error>;

const option = Option.fromResult(result);
// Some<User> or None
```

If the error carries information you still need, recover it with byethrow first and convert the outcome:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
declare const result: Result.Result<User, Error>;
declare const fallbackUser: User;

const option = Option.fromResult(
  Result.pipe(
    result,
    Result.orElse(() => Result.succeed(fallbackUser)),
  ),
);
// Some<User>, the fallback when the original Result failed
```

## Convert asynchronous values

Both converters handle `OptionAsync` and `ResultAsync` the same way, and the result is asynchronous:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

const result = await Option.toResult("No value")(Promise.resolve(Option.some(2)));
// { type: 'Success', value: 2 }, a ResultAsync resolved to a Result

const option = await Option.fromResult(Promise.resolve(Result.succeed(2)));
// { type: 'Some', value: 2 }
```

## Where to convert from one to another

To keep conversions rare, apply the rule of thumb: convert where the meaning changes. Looking up a user with an `Option` can be fine if you can work with a nullable value. If "user not found" becomes an error in your system, convert to a `Result` or use a Result in the first place. For the reasoning behind the split, see [Option vs Result](../explanation/option-vs-result).

In general conversions _from_ Result happen more often than conversions _to_ Result. If you find yourself converting from Result to Option a lot, your system is probably silently dropping relevant errors.
