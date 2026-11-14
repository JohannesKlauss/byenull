---
description: Recover from None with orElse by supplying a fallback Option, continuing the pipeline, and using asynchronous fallbacks.
---

# Recovering options

`orElse` supplies another `Option` when a pipeline reaches `None`. Use it when a fallback should feed into the remaining steps.

## Providing a fallback with `orElse`

`orElse` takes a function with no parameters. It calls that function for a `None` and returns the fallback Option. A `Some` passes through without calling the function:

```ts
import { Option } from "byenull";

const recovered = Option.pipe(
  Option.none(),
  Option.orElse(() => Option.some("fallback")),
);
// { type: 'Some', value: 'fallback' }

const unchanged = Option.pipe(
  Option.some("value"),
  Option.orElse(() => Option.some("fallback")),
);
// { type: 'Some', value: 'value' }, the fallback is not called
```

The fallback must be an `Option` or `OptionAsync`, not a plain value.

## Trying fallback sources

A cache miss can fall back to a default source. Because `orElse` returns an Option, later transformations still run:

```ts
import { Option } from "byenull";

const cache = new Map<string, string>();
const defaults = new Map([["theme", "light"]]);

const readCache = Option.fn((key: string) => cache.get(key));
const readDefault = Option.fn((key: string) => defaults.get(key));

const theme = Option.pipe(
  readCache("theme"),
  Option.orElse(() => readDefault("theme")),
  Option.map((theme) => theme.toUpperCase()),
);
// { type: 'Some', value: 'LIGHT' }
```

Only the missing cache entry triggers `orElse`. If the cache contains a theme, `readDefault` is not called.

## Using asynchronous fallbacks

The fallback function can return an `OptionAsync`. `orElse` also waits for Promise-based input before deciding whether recovery is needed:

```ts
import { Option } from "byenull";

const theme = await Option.pipe(
  Option.none(),
  Option.orElse(() => Option.maybe(async () => "dark")),
  Option.map((theme) => theme.toUpperCase()),
);
// { type: 'Some', value: 'DARK' }
```

Here `maybe` wraps the asynchronous fallback. A nullish resolution or Promise rejection would become `None`.

## Choosing between `orElse` and `unwrap`

`orElse` recovers with another Option and keeps the pipeline open. `unwrap` recovers with a plain default value and ends the pipeline. It never throws for a `None`.

Use `orElse` while more Option steps remain to be available. Use [`unwrap`](../resolving/unwrapping-options) when the caller needs a plain value.
