# byenull-oxlint

[![npm version](https://badge.fury.io/js/byenull-oxlint.svg)](https://www.npmjs.com/package/byenull-oxlint)
[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE)

Oxlint plugin/preset for [byenull](https://www.npmjs.com/package/byenull). It enforces consistent usage of the `Option` and `O` namespaces across your codebase.

## Installation

```bash
pnpm add -D byenull-oxlint oxlint
```

## Usage

### Using the recommended preset

```ts
import oxlintByenullPlugin from "byenull-oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [oxlintByenullPlugin.recommended],
});
```

### Configuring rules manually

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: [
    {
      name: "byenull",
      specifier: "byenull-oxlint",
    },
  ],
  rules: {
    "byenull/consistent-namespace": "error", // or ["error", "O"] to prefer `O`
  },
});
```

## Rules

### `byenull/consistent-namespace`

Enforces a single namespace when importing from `byenull`. `byenull` exports its API under two namespaces, `Option` and `O`. This rule keeps imports consistent so both never appear in the same codebase.

Pass the accepted namespace as the rule's option (the second array element). Accepts `"Option"` (default) or `"O"`:

```ts
rules: {
  "byenull/consistent-namespace": "error", // "Option" (default)
  "byenull/consistent-namespace": ["error", "O"], // "O"
}
```

```ts
// "Option" (default)
import { O } from "byenull"; // ❌ Use `Option` instead of `O` as the byenull namespace.
import { Option } from "byenull"; // ✅

// "O"
import { Option } from "byenull"; // ❌
import { O } from "byenull"; // ✅
```

The rule is auto-fixable: it rewrites the import specifier and all of its usages.

### `byenull/no-ambiguous-some-type`

Disallows non-specific Some types (`unknown`, `any`, `object`, `{}`) as the value type of `Option`, `OptionAsync`, `OptionMaybeAsync`, or `Some`. Specify a concrete type instead.

```ts
import { Option } from "byenull";

type A = Option.Option<unknown>; // ❌ Specify a concrete Some type instead of `unknown`.
type B = Option.Option<any>; // ❌
type C = Option.Option<object>; // ❌
type D = Option.Option<{}>; // ❌
type E = Option.Option<User>; // ✅
```

### `byenull/no-negated-type-guards`

Disallows negating `Option.isSome()` or `Option.isNone()`. Use the opposite guard instead.

```ts
import { Option } from "byenull";

if (!Option.isSome(option)) {
} // ❌ Use `Option.isNone(option)` instead.
if (Option.isNone(option)) {
} // ✅
```

The rule is auto-fixable: it replaces the negated guard with its counterpart.

### `byenull/prefer-option-async`

Prefers `OptionAsync<T>` over `Promise<Option<T>>`.

```ts
import { Option } from "byenull";

type A = Promise<Option.Option<string>>; // ❌ Use `OptionAsync<T>` instead.
type B = Option.OptionAsync<string>; // ✅
```

The rule is auto-fixable: it rewrites the wrapped type.

### `byenull/prefer-option-maybe-async`

Prefers `OptionMaybeAsync<T>` over a union of `Option<T> | OptionAsync<T>`.

```ts
import { Option } from "byenull";

type A = Option.Option<string> | Option.OptionAsync<string>; // ❌ Use `OptionMaybeAsync<T>` instead.
type B = Option.OptionMaybeAsync<string>; // ✅
```

The rule is auto-fixable: it collapses the union, preserving any additional union members.

### `byenull/prefer-option-matchers`

Prefers the [byenull-testing](https://www.npmjs.com/package/byenull-testing) matchers over manual assertions in test files (`**/*.test.*`, `**/__tests__/**/*`):

```ts
import { Option } from "byenull";

expect(Option.isSome(option)).toBe(true); // ❌ Use `expect(option).toBeSome()`.
assert(Option.isSome(option)); // ❌ Use `expect(option).toBeSome((value) => {})`.
Option.unwrap(option); // ❌ Use `expect(option).toBeSome((value) => {})`.

expect(option).toBeSome(); // ✅
expect(option).toBeNone(); // ✅
```

The rule is auto-fixable and understands `.not`, `toBe(true|false)`, `toBeTruthy()`, and `toBeFalsy()` flips.

### Settings

Customize which module names and namespaces are considered byenull imports via the `byenull` setting:

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  settings: {
    byenull: {
      module: ["byenull", "custom-byenull-alias"],
      namespace: ["Option", "O", "Opt"],
    },
  },
});
```

## License

This project is licensed under the [MIT license](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE).
