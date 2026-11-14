---
description: The two import styles of byenull, the Option namespace and the O shorthand alias, how both support tree-shaking, and how to keep a codebase on one style.
---

# How to choose an import style

To keep your codebase readable and easy to search, pick one of byenull's two import styles and use it everywhere. Both expose exactly the same functions, and both fully support tree-shaking, so the choice is purely a matter of style.

## Use `Option` for explicit code

If you want every line to say where its functions come from, import the `Option` namespace:

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
const users: User[] = [{ id: "u123", name: "Alice" }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const option = Option.pipe(
  Option.some("u123"),
  Option.andThen((id) => findUser(id, users)),
  Option.map((user) => user.name),
);
```

## Use `O` for compact pipelines

If you prefer fewer keystrokes, import the `O` alias:

```ts
import { O } from "byenull";

type User = { id: string; name: string };
const users: User[] = [{ id: "u123", name: "Alice" }];

const findUser = O.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const option = O.pipe(
  O.some("u123"),
  O.andThen((id) => findUser(id, users)),
  O.map((user) => user.name),
);
```

The examples in this documentation use `Option`, but everything works the same with `O`.

## Verify tree-shaking after adding the dependency

Although you import a namespace, each function is an independent export. Modern bundlers keep only the functions you actually use, so a bundle that only calls `fn` does not contain `pipe`, `map`, or `andThen`. To confirm, check your bundle's output after importing byenull, or trust your bundler's tree-shaking analysis for `sideEffects`-free packages.

## Keep one style per codebase

To avoid inconsistent, hard-to-search code, do not mix the two styles. If a file mixes them, split the imports:

```ts
// @filename: mixed.ts
// ❌ Mixing both styles
import { Option, O } from "byenull";

const findUser = Option.fn((id: string) => ({ id, name: "Alice" }));
const option = O.pipe(
  O.some("u123"),
  O.andThen((id) => findUser(id)),
);
// ---cut-before---
// @filename: consistent.ts
// ✅ One style throughout
import { Option } from "byenull";

const findUser = Option.fn((id: string) => ({ id, name: "Alice" }));
const option = Option.pipe(
  Option.some("u123"),
  Option.andThen((id) => findUser(id)),
);
```

If an existing codebase already uses both, standardize on `Option`, the easier one for newcomers to search for, and migrate `O` usages file by file.
