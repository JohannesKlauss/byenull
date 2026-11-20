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
    "byenull/consistent-namespace": "error",
  },
});
```

## Rules

### `byenull/consistent-namespace`

Enforces a single namespace when importing from `byenull`. `byenull` exports its API under two namespaces, `Option` and `O`. This rule keeps imports consistent so both never appear in the same codebase.

Options: `"Option"` (default) or `"O"`.

```ts
// "Option" (default)
import { O } from "byenull"; // ❌ Use `Option` instead of `O` as the byenull namespace.
import { Option } from "byenull"; // ✅

// "O"
import { Option } from "byenull"; // ❌
import { O } from "byenull"; // ✅
```

The rule is auto-fixable: it rewrites the import specifier and all of its usages.

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
