---
description: "Crossing the boundary to @praha/byethrow: converting an Option to a typed Result with toResult, and back with fromResult, when absence becomes failure."
---

# Converting to Results

Sometimes "it's not there" is fine, and sometimes it is an error someone must handle. In this last chapter we will cross that line: we convert our lookup's `Option` into a `Result` from [@praha/byethrow](https://praha-inc.github.io/byethrow/), where the empty case becomes a typed failure.

## Converting an Option to a Result

`toResult` takes the error to use when the Option is a `None`:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const users: User[] = [{ id: "u1", name: "Alice" }];

const result = Option.pipe(findUser("u1", users), Option.toResult(new Error("User not found")));
// { type: 'Success', value: { id: 'u1', name: 'Alice' } }

const failure = Option.pipe(findUser("u404", users), Option.toResult(new Error("User not found")));
// { type: 'Failure', error: Error('User not found') }
```

The `None` carried no information, so we supply the error at the conversion. That is the moment our code decides that this absence is a failure.

## Our project: reporting a missing profile

Let's finish the project by making the missing _user_ a reported error, while a missing _profile_ stays a mere absence with a name fallback. We convert first, then continue in byethrow's own `pipe`:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
type Profile = { userId: string; displayName?: string };

const users: User[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];
const profiles: Profile[] = [{ userId: "u1", displayName: "Alice A." }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));
const findProfile = Option.fn((userId: string, profiles: Profile[]) =>
  profiles.find((profile) => profile.userId === userId),
);

const displayName = (id: string) =>
  Result.pipe(
    // Convert at the boundary: absence becomes a typed failure.
    Option.toResult(new Error(`User not found: ${id}`))(findUser(id, users)),
    Result.andThen((user) =>
      // The profile lookup stays in the world of Options.
      Option.pipe(
        findProfile(user.id, profiles),
        Option.andThen((profile) => Option.some(profile.displayName)),
        Option.orElse(() => Option.some(user.name)),
        Option.toResult(new Error(`Profile broken: ${user.id}`)),
      ),
    ),
  );

displayName("u1"); // { type: 'Success', value: 'Alice A.' }
displayName("u2"); // { type: 'Success', value: 'Bob' }, profile absence stayed an Option
displayName("u404"); // { type: 'Failure', error: Error('User not found: u404') }
```

The lookup starts as an Option, converts to a `Result` at the point where absence becomes failure, and then continues with byethrow's `andThen`. The two libraries compose naturally.

## Converting a Result to an Option

The other direction is `fromResult`: a `Success` becomes a `Some`, and any `Failure` becomes a `None`, and the error is discarded:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
declare const result: Result.Result<User, Error>;

const option = Option.fromResult(result);
// Some<User>, or None when the Result failed
```

Because the error is lost, we convert Result→Option only when we truly don't care why it failed, for example after recovering the error on the Result side first.

## Async conversions

Both functions handle asynchronous values the same way. The result is a `ResultAsync` or an `OptionAsync`:

```ts
import { Option } from "byenull";
import { Result } from "@praha/byethrow";

const result = await Option.toResult("No value")(Promise.resolve(Option.some(2)));
// { type: 'Success', value: 2 }

const option = await Option.fromResult(Promise.resolve(Result.succeed(2)));
// { type: 'Some', value: 2 }
```

## Where the tutorial ends

We built a profile lookup that starts with a nullable `find`, handles every absence, and ends either as a guaranteed value or as a typed failure, with the two libraries sharing one workflow.

From here:

- [How-to guides](../../how-to/importing-option): recipes for real-world tasks
- [Explanation](../../explanation/option-vs-result): the reasoning behind the Option/Result split
- [API Reference](/api/modules/Option): every function and type, generated from the source
