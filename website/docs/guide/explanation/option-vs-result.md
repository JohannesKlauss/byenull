---
description: "How to choose between absence without a reason, anticipated failures with typed errors, and unexpected exceptions, plus where to convert between Option and Result."
---

# Option vs Result

byenull and [@praha/byethrow](https://praha-inc.github.io/byethrow/) represent different outcomes. An `Option` represents a computation that can have no value. A `Result` represent a computation that can fail. Choose between them by deciding what the caller needs to know and how it can respond.

## Use Option when absence needs no explanation

A lookup can legitimately return nothing without providing an error:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
declare const users: readonly User[];

const findUser = (id: string): Option.Option<User> =>
  Option.some(users.find((user) => user.id === id));
```

A search screen might display the same empty state for every missing user. `None` is enough for that decision. It has no message, cause, or error type, so it does not explain why the lookup returned nothing.

Absence is not inherently separate from failure. The domain determines which model fits. A missing user can be an ordinary search result in one function and a failed authentication requirement in another.

## Use Result for anticipated failures with useful errors

A `Failure` carries an error. Its type can tell the caller which anticipated failures need handling:

```ts
import { Result } from "@praha/byethrow";

class InvalidUserIdError extends Error {}

const parseUserId = (input: string): Result.Result<string, InvalidUserIdError> => {
  if (!input.startsWith("u_")) {
    return Result.fail(new InvalidUserIdError("A user ID must start with u_"));
  }

  return Result.succeed(input);
};
```

This is useful when the caller can show a validation message, return a specific HTTP response, retry a defined operation, or combine several typed errors. The error stays available for those decisions.

Expected file, network, and parsing failures can fit this model. An operation does not need a `Result` merely because it performs I/O or uses code that can throw. The caller's response is the deciding factor.

## Let unexpected failures throw or reject

Some failures indicate a bug or a problem that only top-level infrastructure can report. Examples include reading a property from an incorrectly initialized object or losing a required database connection. If the caller cannot respond differently to these failures, adding them to a broad `Result<T, Error>` return type creates handling code without giving the caller a useful choice.

Let those failures throw or reject, then report them at the application boundary. This follows the same division used in [byethrow's error-handling guidance](https://praha-inc.github.io/byethrow/guide/best-practices/result-vs-throw): anticipated failures that callers handle belong in `Result`, while unexpected failures can remain exceptions.

Be careful when wrapping asynchronous work with `Option.fn` or `Option.maybe`. They convert every Promise rejection to `None` and discard the error. Use them only when that loss is acceptable.

## Convert where the caller's needs change

`toResult(error)` turns `Some` into `Success` and `None` into `Failure` with the supplied error. Since `None` contains no information, the call site must provide an error that fits its context.

`fromResult` turns `Success` into `Some` and every `Failure` into `None`. It discards the error:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type Config = { host: string };

declare const optionalConfig: Option.Option<Config>;
declare const loadedConfig: Result.Result<Config, Error>;

const requiredConfig = Option.pipe(
  optionalConfig,
  Option.toResult(new Error("The application requires a config")),
);

const cachedConfig: Option.Option<Config> = Option.fromResult(loadedConfig);
// A Failure's Error is no longer available in cachedConfig
```

Handle or log a `Failure` before `fromResult` if its error still matters. Both converters handle asynchronous inputs. Await their results when the input is asynchronous.

Keep conversions near the decision that changes the return type. An optional cache lookup can remain an `Option`. If startup cannot continue without that value, convert once to a `Result` with a startup-specific error. Converting every lookup before that point forces absence-only code to handle errors it does not need.
