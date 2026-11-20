---
description: "Recipes for turning nullish-returning APIs into Options that compose: Array.find, Map.get, DOM queries, environment variables, and third-party SDKs."
---

# How to handle nullish values

To make a nullable lookup type-safe, convert its result into an `Option` at the source, then compose from there. This guide collects the patterns for the nullish values you'll often meet in real code.

## Turn `Array.find` into an Option

`find` returns `undefined` when nothing matches. To work with the result type-safely, wrap the lookup with `fn`:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
const users: User[] = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const alice = findUser("u1", users);
// { type: 'Some', value: { id: 'u1', name: 'Alice' } }

const nobody = findUser("u404", users);
// { type: 'None' }
```

To keep chaining, see [pipe basics](../tutorial/transforming/pipe-basics).

## Read from a `Map` with `some`

`Map.get` returns `V | undefined`. Pass the result straight through `some`, which normalizes `undefined` into a `None`:

```ts
import { Option } from "byenull";

const settings = new Map<string, string>([["theme", "dark"]]);

const theme = Option.pipe(Option.some(settings.get("theme")), Option.unwrap("light"));
// 'dark', or 'light' when the key is missing
```

## Query the DOM with `maybe`

DOM lookups return `null` when nothing matches. To evaluate a lookup immediately, use `maybe`:

```ts
import { Option } from "byenull";

const main = Option.maybe(() => document.querySelector("main"));
// Some<HTMLElement> or None
```

## Read environment variables safely

`process.env` values are `string | undefined`. To handle a missing variable without a null check, wrap the read:

```ts
// @types: node
import { Option } from "byenull";

const apiUrl = Option.pipe(
  Option.some(process.env.API_URL),
  Option.unwrap("http://localhost:3000"),
);
```

## Absorb nullish values from a third-party SDK

If a library returns `null` for "not found" instead of throwing, wrap the call with `fn` and the nullish result becomes a `None`:

```ts
declare function getFeatureFlag(key: string): boolean | null;

import { Option } from "byenull";

const isEnabled = Option.fn(getFeatureFlag)("beta-ui");
// Some<boolean> or None
```

## Fetch data that may be missing

To handle an API that resolves with `null` or rejects, wrap the request with `fn`. The asynchronous path converts both a nullish resolution and a rejection into a `None`:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };

const fetchUser = Option.fn(async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json() as Promise<User | null>;
});

const user = await fetchUser("u1");
// Some<User>, or None when the request fails or the API returns null
```

## When the source throws instead of returning nullish

`fn` and `maybe` convert nullish return values and rejected promises. A synchronous throw propagates to the caller. To absorb a throwing API such as `JSON.parse`, convert the throw into a nullish value yourself:

```ts
import { Option } from "byenull";

const parseJson = Option.fn((text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
});

const json = parseJson('{"name": "Alice"}');
// { type: 'Some', value: { name: 'Alice' } }

const broken = parseJson("not json");
// { type: 'None' }
```

If the operation can meaningfully fail with an error worth keeping, model it as a `Result` with [@praha/byethrow](https://praha-inc.github.io/byethrow/) instead. See [converting between Option and Result](./converting-between-option-and-result) for how.
