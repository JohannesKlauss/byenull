# byenull-testing 👋

[![npm version](https://badge.fury.io/js/byenull-testing.svg)](https://www.npmjs.com/package/byenull-testing)
[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE)

Custom test matchers for asserting [byenull](https://github.com/JohannesKlauss/byenull) Options in Vitest and Jest.

## Installation

```bash
pnpm add -D byenull-testing
```

## Setup

Register the matchers in a setup file:

```ts title="vitest.setup.ts"
import { expect } from "vitest";
import { toBeNone, toBeSome } from "byenull-testing";

import type { OptionMatchers } from "byenull-testing";

declare module "vitest" {
  interface Matchers<R, T> extends OptionMatchers<R, T> {}
}

expect.extend({ toBeSome, toBeNone });
```

```ts title="vitest.config.ts"
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

## Usage

```ts
import { O } from "byenull";
import { expect, test } from "vitest";

test("finds the user", () => {
  expect(findUser("u1", users)).toBeSome((user) => {
    expect(user.name).toBe("Alice"); // user is typed as the Some value
  });
});

test("finds no user", () => {
  expect(findUser("u404", users)).toBeNone();
});
```

## Documentation

See [Testing Options](https://github.com/JohannesKlauss/byenull/tree/main/website/docs/guide/how-to/testing-options.md) in the byenull documentation for full setup instructions for Vitest and Jest.

## License

This project is [MIT](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE) licensed.
