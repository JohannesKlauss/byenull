---
description: "Integrate byenull into Zod or Valibot schemas and use parsed fields as Options."
---

# Integrate with Schema Libraries

Wrap selected fields with `option` to receive byenull Options when you parse an object. Follow the [Zod steps](#use-zod) or [Valibot steps](#use-valibot) for your library.

## Use Zod

### 1. Install the packages

```bash
pnpm add byenull @praha/byethrow zod@^4.6.7
```

### 2. Wrap the fields you want as Options

Import `option` from `byenull/zod` and wrap each field's existing schema. Leave other fields unchanged.

```ts
import { z } from "zod";
import { option } from "byenull/zod";

const User = z.object({
  name: z.string(),
  nickname: option(z.string()),
});
```

You do not need to add `.optional()` or `.nullable()` to the wrapped field. A missing nickname, `undefined`, or `null` becomes None; a valid string becomes Some.

### 3. Parse the object and use the Option

Parse with Zod as usual, then use byenull's `Option` functions on the result.

```ts
import { z } from "zod";
import { Option } from "byenull";
import { option } from "byenull/zod";

const User = z.object({
  name: z.string(),
  nickname: option(z.string()),
});

const user = User.parse({ name: "Ada" });
const displayName = Option.pipe(user.nickname, Option.unwrap(user.name));
// "Ada"

const withNickname = User.parse({ name: "Ada", nickname: "Ace" });
const greeting = Option.pipe(withNickname.nickname, Option.unwrap(withNickname.name));
// "Ace"
```

Invalid values still fail Zod validation. Use `safeParse` instead of `parse` if you want to handle validation errors without throwing.

### Supply a default nickname

Put a Zod default inside `option` when you want a fallback for a missing or undefined field. In this recipe, null still produces None.

```ts
import { z } from "zod";
import { option } from "byenull/zod";

const User = z.object({
  nickname: option(z.string().default("Guest")),
});

const omitted = User.parse({});
// { nickname: { type: "Some", value: "Guest" } }
const explicitUndefined = User.parse({ nickname: undefined });
// { nickname: { type: "Some", value: "Guest" } }
const explicitNull = User.parse({ nickname: null });
// { nickname: { type: "None" } }
```

### Parse an async schema

If a field uses an async refinement or transform, keep the same `option` helper and use `parseAsync` or `safeParseAsync`.

```ts
import { z } from "zod";
import { option } from "byenull/zod";

const User = z.object({
  nickname: option(z.string().transform(async (name) => name.toUpperCase())),
});

const user = await User.parseAsync({ nickname: "Ada" });
// { nickname: { type: "Some", value: "ADA" } }
```

## Use Valibot

### 1. Install the packages

```bash
pnpm add byenull @praha/byethrow valibot@^1.5.0
```

### 2. Wrap fields and parse the object

Import `option` from `byenull/valibot`, wrap the fields you want as Options, and parse with Valibot. Missing, undefined, or null nicknames become None; valid strings become Some.

```ts
import * as v from "valibot";
import { Option } from "byenull";
import { option } from "byenull/valibot";

const User = v.object({
  name: v.string(),
  nickname: option(v.string()),
});

const user = v.parse(User, { name: "Ada" });
const displayName = Option.pipe(user.nickname, Option.unwrap(user.name));
// "Ada"

const withNickname = v.parse(User, { name: "Ada", nickname: "Ace" });
const greeting = Option.pipe(withNickname.nickname, Option.unwrap(withNickname.name));
// "Ace"
```

Invalid values still fail Valibot validation. Use `v.safeParse` if you want to handle validation errors without throwing.

### Supply a display fallback

Use `Option.unwrap` after parsing when you want a fallback for a missing nickname. Unlike the Zod default recipe, Valibot's nullish wrapper skips inner defaults for missing, undefined, and null inputs.

```ts
import * as v from "valibot";
import { Option } from "byenull";
import { option } from "byenull/valibot";

const User = v.object({ nickname: option(v.string()) });
const user = v.parse(User, {});
const nickname = Option.pipe(user.nickname, Option.unwrap("Guest"));
// "Guest"
```

### Parse an async schema

For async fields, use `v.objectAsync` and `v.parseAsync` (or `v.safeParseAsync`). Keep the same `option` helper; synchronous fields can still use `v.object` and `v.parse`.

```ts
import * as v from "valibot";
import { option } from "byenull/valibot";

const User = v.objectAsync({
  nickname: option(
    v.pipeAsync(
      v.string(),
      v.transformAsync(async (name) => name.toUpperCase()),
    ),
  ),
});

const user = await v.parseAsync(User, { nickname: "Ada" });
// { nickname: { type: "Some", value: "ADA" } }
```

Wrap the field directly rather than adding an outer optional wrapper if you want the output to always contain an Option. The recipes use the tested versions Zod 4.6.7 and Valibot 1.5.0 as their minimums.

See the [Zod API](../../api/zod/functions/option) or [Valibot API](../../api/valibot/functions/option) for helper signatures, and [unwrapping Options](../tutorial/resolving/unwrapping-options) for more ways to use the parsed fields.
