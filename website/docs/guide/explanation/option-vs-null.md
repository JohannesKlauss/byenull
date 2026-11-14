---
description: Why an Option beats repeated null checks and optional-chaining chains, where it pays off, and when plain nullish handling is fine.
---

# Option vs null and undefined

Why wrap a nullable value in an `Option` at all, when `strictNullChecks` already forces you to handle `null` and `undefined`? The short answer: the compiler checks each _lookup_ once, but your _code_ still repeats the checking, and repeating checks is where bugs live.

## The problem with nullish checks

A nullable value carries its ambiguity everywhere it goes. Every consumer has to re-check, and every layer of access adds another chance to forget:

```ts
// @noErrors
type User = { id: string; profile?: { email?: string } };
declare const user: User | null;

// The check is repeated at every layer, and each layer can go wrong:
const email = user?.profile?.email ?? "unknown";
const domain = email.split("@")[1] ?? "unknown";
```

Optional chaining and nullish coalescing are readable, but they say nothing about _why_ a value is missing. `??` treats "not loaded", "not found", and "not applicable" identically, and a long `?.` chain silently produces `undefined` at any point. The failure moves to wherever the `undefined` finally explodes.

With `Option`, the ambiguity is resolved once, at the source, and the rest of the code works on a value that simply _is_:

```ts
import { Option } from "byenull";

type User = { id: string; email: string };
const users: User[] = [{ id: "u1", email: "alice@example.com" }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const domain = Option.pipe(
  Option.some("u1"),
  Option.andThen((id) => findUser(id, users)),
  Option.map((user) => user.email.split("@")[1]),
  Option.unwrap("unknown"),
);
```

## Presence as a type

An `Option<T>` is the union `Some<T> | None`. The two variants are distinguished by a plain `type` property, so the compiler, not a convention, enforces that you check before you access `value`. Once you have checked with `isSome`, narrowing makes `value` available without a cast.

This is the same move TypeScript's own `strictNullChecks` makes with `T | null`. The difference is composability: an `Option` can be passed to `map`, `andThen`, and `orElse` as a unit, while a nullable has to be re-examined at every step. Options compose; null checks accumulate.

## Why the checks don't compose

Consider a pipeline of lookups where each step can come up empty. With nullish values, the plumbing dominates the logic:

```ts
// @noErrors
declare const findUser: (id: string) => User | null;
declare const findProfile: (user: User) => Profile | null;
declare const findAvatar: (profile: Profile) => string | null;

const user = findUser("u1");
const profile = user && findProfile(user);
const avatar = profile && findAvatar(profile);
```

With Options, absence short-circuits through the same pipeline the happy path uses. The steps that need a value simply don't run when there isn't one.

## When not to use an Option

An `Option` earns its keep at boundaries where absence is a real, meaningful outcome: lookups, queries, configuration, parsed data. For values that are obviously present, like a constant, a freshly constructed object, or a parameter you just validated, wrapping them adds noise. `some()` is a conversion of ambiguity into structure; it cannot create ambiguity that isn't there, and there is no point pretending it can.

Similarly, if a function's nullish result is immediately consumed in the next line, a plain check is often clearer. Options start to pay off the moment the nullable value crosses a function boundary or feeds into further steps.
