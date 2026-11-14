---
description: "How to mix synchronous and asynchronous Options in one pipeline: wrap async APIs with fn, let andThen carry the Promise, and await the final result."
---

# How to mix sync and async Options

To build a pipeline that calls both synchronous and asynchronous code, keep one rule: write every step the same way, and `await` the result once at the end. Every byenull function accepts an `Option`, a `Promise` of an `Option`, or returns one, so a single async step makes the whole pipeline asynchronous and nothing else in your code changes.

## Call an async API inside a pipeline

To bring an asynchronous operation into a pipeline, wrap it with `fn` and chain it with `andThen`. The step after it receives the resolved value:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
const users: User[] = [{ id: "u123", name: "Alice" }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const fetchAvatar = Option.fn(async (user: User) => {
  const response = await fetch(`/api/avatars/${user.id}`);
  return response.json() as Promise<{ url: string } | null>;
});

const avatarUrl = await Option.pipe(
  Option.some("u123"),
  Option.andThen((id) => findUser(id, users)), // sync
  Option.andThen(fetchAvatar), // async
  Option.map((avatar) => avatar.url),
);
// Option<string>
```

## Start a pipeline from a Promise

If your input is already a `Promise<Option<T>>`, for example an `OptionAsync` produced elsewhere, pass it as the first argument of `pipe` and `await` the result:

```ts
import { Option } from "byenull";

type Config = { host: string };

const loadConfig = async (): Promise<Option.Option<Config>> => {
  const response = await fetch("/api/config");
  return Option.some((await response.json()) as Config | null);
};

const config = await Option.pipe(
  loadConfig(), // OptionAsync<Config>
  Option.map((config) => config.host),
);
// Option<string>
```

## Recover asynchronously

To provide a fallback that is itself asynchronous, give `orElse` a thunk that returns an `OptionAsync`:

```ts
import { Option } from "byenull";

declare function readThrough(key: string): Promise<string | null>;
declare function warmUp(): Promise<string | null>;

const value = await Option.pipe(
  Option.some("session-key"),
  Option.andThen((key) => Option.maybe(() => readThrough(key))), // async lookup
  Option.orElse(() => Option.maybe(() => warmUp())), // async fallback
  Option.unwrap("anonymous"),
);
// string
```

## Unwrap an asynchronous Option

`unwrap` returns a `Promise` when its input is asynchronous, so `await` the call, or leave the `Promise` and continue in async code:

```ts
import { Option } from "byenull";

const value = await Option.unwrap(0)(Promise.resolve(Option.some(42)));
// 42
```

## When you don't know whether a value is async

If a value's type is `OptionMaybeAsync<T>`, sometimes an `Option` and sometimes a `Promise` of one, the same functions still apply, and the result reflects both possibilities:

```ts
import { Option } from "byenull";

declare const option: Option.OptionMaybeAsync<number>;

const value = Option.unwrap(0)(option);
// number | Promise<number>
```

To force a single path, normalize with `await` inside an `async` function first.
