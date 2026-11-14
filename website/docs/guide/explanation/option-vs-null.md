---
description: "When an Option helps compose dependent operations, when nullish values are clearer, and what information both representations leave out."
---

# Option vs null and undefined

TypeScript's `strictNullChecks` already requires you to handle nullable values. An `Option` does not remove that obligation. It gives presence and absence a common set of combinators, which helps when several operations depend on the same value.

For an immediate local decision, a nullish value is often simpler. Neither representation explains why a value is missing. `None` deliberately carries no reason.

## Use nullish values for local decisions

Optional chaining handles a short lookup without extra imports or wrappers:

```ts
type User = { profile?: { displayName?: string } };
declare const user: User | null;

const displayName = user?.profile?.displayName ?? "Anonymous";
// displayName is a string
```

This code has one fallback close to the data it uses. Wrapping `user` and the nested fields in Options would add work without changing the result.

Plain nullish values also preserve the difference between `null` and `undefined`. The `some`, `fn`, and `maybe` creators collapse both into `None`. That is helpful when both mean "no value", but harmful when a protocol assigns them different meanings. For example, a patch format can use `undefined` to leave a field unchanged and `null` to clear it. Do not normalize that distinction away.

## Use Options for dependent operations

Consider three lookups where each step needs the previous value. Both versions below are type-safe. They differ in where they handle absence:

```ts
import { Option } from "byenull";

type User = { id: string };
type Profile = { userId: string };

declare function findUser(id: string): User | null;
declare function findProfile(user: User): Profile | null;
declare function findAvatar(profile: Profile): string | null;

const user = findUser("u1");
const profile = user === null ? null : findProfile(user);
const nullableAvatar = profile === null ? null : findAvatar(profile);
// nullableAvatar is a string or null

const findUserOption = Option.fn(findUser);
const findProfileOption = Option.fn(findProfile);
const findAvatarOption = Option.fn(findAvatar);

const avatar: string = Option.pipe(
  findUserOption("u1"),
  Option.andThen(findProfileOption),
  Option.andThen(findAvatarOption),
  Option.unwrap("/default-avatar.png"),
);
// A missing value at any step selects the default avatar
```

The nullable version states each check next to the call it guards. The Option version runs `andThen` callbacks only for `Some` and handles every `None` at `unwrap`. A fourth dependent lookup adds one `andThen` step, rather than another variable and null check.

There is a real setup cost here. The Option version wraps three existing functions. If nothing else uses those wrappers, the nullable version may be the better choice. The wrappers become more useful when several callers share the same lookups or when the pipeline continues with recovery and transformation steps.

## Narrowing works with both representations

With `strictNullChecks`, TypeScript narrows `T | null` after a null check. With an `Option<T>`, `isSome` narrows `Some<T> | None` and exposes `value`:

```ts
import { Option } from "byenull";

declare const option: Option.Option<string>;

if (Option.isSome(option)) {
  const uppercased: string = option.value.toUpperCase();
  console.log(uppercased);
}
```

The compiler enforces access in both cases. Option's added value is the ability to pass the whole union through `map`, `andThen`, and `orElse`, not a stronger narrowing rule.

The nullish normalization performed by constructors also has limits. `Some<T>` does not exclude nullish types for hand-built objects, and `isOption` only checks the object's structure. See [Design principles](./design-principles#constructors-normalize-nullish-values) before accepting Option-shaped data from an external source.

## Keep the reason when callers need it

A nullish result and `None` can both represent "not loaded", "not found", or "not applicable". Neither records which outcome occurred. If those outcomes need different handling, use a richer return type or a `Result` with a typed error.

`fn` and `maybe` also discard the reason for a Promise rejection. That is appropriate only when every rejection can share the same empty-case handling.

Return an `Option` when callers will compose operations and treat every empty case alike. Return a nullable value when the caller will check it immediately or needs to distinguish `null` from `undefined`. If a value has already been validated, wrapping it only to unwrap it in the next statement adds no useful check.
