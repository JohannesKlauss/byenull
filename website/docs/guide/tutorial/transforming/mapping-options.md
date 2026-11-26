---
description: Transform values inside Options with map, including nullish normalization, asynchronous inputs, and the difference between map and andThen.
---

# Mapping options

`map` transforms the value inside an `Option`. It changes the value without adding another way for the pipeline to fail.

## Transforming values with `map`

For a `Some`, `map` calls the function and wraps the returned value. For a `None`, it skips the function and returns the `None` unchanged:

```ts
import { Option } from "byenull";

const option = Option.pipe(
  Option.some(2),
  Option.map((value) => value * 10),
);
// { type: 'Some', value: 20 }

const empty = Option.pipe(
  Option.none(),
  Option.map((value: number) => value * 10),
);
// { type: 'None' }, the callback is not called
```

The callback can change the value type. Mapping a `User` to `user.name`, for example, produces an `Option<string>`.

## Normalizing nullish callback results

`map` passes the callback result through `some`. A callback that returns `null` or `undefined` therefore produces a `None`:

```ts
import { Option } from "byenull";

type Profile = { displayName: string | null };

const profile: Profile = { displayName: null };

const displayName = Option.pipe(
  Option.some(profile),
  Option.map((profile) => profile.displayName),
);
// { type: 'None' }
```

`some`, `fn`, and `maybe` apply the same normalization to the values they wrap. `fn` and `maybe` also convert Promise rejections to `None`. Synchronous throws still propagate.

## Mapping asynchronous Options

`map` accepts an `OptionAsync`. It waits for the input and then runs its synchronous callback on the value:

```ts
import { Option } from "byenull";

const product = Promise.resolve(Option.some({ name: "Keyboard" }));

const name = await Option.pipe(
  product,
  Option.map((product) => product.name),
);
// { type: 'Some', value: 'Keyboard' }
```

Do not pass an `async` callback to `map`. The callback would return a Promise as an ordinary value, and `map` would not wait for the transformation. Use `andThen` with a callback that returns an `Option` or `OptionAsync` instead:

```ts
import { Option } from "byenull";

const fetchProduct = Option.fn(async (id: string) => {
  return id === "p1" ? { name: "Keyboard" } : null;
});

const name = await Option.pipe(
  Option.some("p1"),
  Option.andThen(fetchProduct),
  Option.map((product) => product.name),
);
// { type: 'Some', value: 'Keyboard' }
```

Here `andThen` runs the asynchronous lookup. The following `map` only formats the resolved product.

## Choosing between `map` and `andThen`

Use `map` for a synchronous transformation. Use `andThen` when the callback is asynchronous and/or can return an absent value wrapped in Option. `andThen` uses that Option as the next pipeline value instead of nesting it, and a `None` skips its callback:

```ts
import { Option } from "byenull";

type Profile = { nickname?: string };

const profile: Profile = { nickname: "Ada" };
const getNickname = Option.fn((profile: Profile) => profile.nickname);

const nested = Option.pipe(Option.some(profile), Option.map(getNickname));
// { type: 'Some', value: { type: 'Some', value: 'Ada' } }

const flat = Option.pipe(Option.some(profile), Option.andThen(getNickname));
// { type: 'Some', value: 'Ada' }
```

See [How to handle nullish values](../../how-to/handling-nullish-values) for ways to wrap nullable APIs before mapping them.
