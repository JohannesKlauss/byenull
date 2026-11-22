---
description: "Assert Options in Vitest and Jest with the byenull-testing matchers toBeSome and toBeNone: setup, typed value callbacks, and the .not caveat."
---

# How to test Options

To assert `Option` values without unwrapping them by hand, install `byenull-testing` and register its matchers. `toBeSome` and `toBeNone` read better than `toEqual`, and their failure messages show the received value.

## Install the package

```bash
pnpm add -D byenull-testing
```

## Set up Vitest

Register the matchers in a setup file, load it from your Vitest configuration, and augment the matcher types:

```ts title="vitest.setup.ts" no-twoslash
import { expect } from "vitest";
import { toBeNone, toBeSome } from "byenull-testing";

import type { OptionMatchers } from "byenull-testing";

declare module "vitest" {
  interface Matchers<R, T> extends OptionMatchers<R, T> {}
}

expect.extend({ toBeSome, toBeNone });
```

```ts title="vitest.config.ts" no-twoslash
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

## Set up Jest

The same matchers work in Jest. Register them in a setup file and augment the `expect` module:

```ts title="jest.setup.ts" no-twoslash
import { expect } from "@jest/globals";
import { toBeNone, toBeSome } from "byenull-testing";

import type { OptionMatchers } from "byenull-testing";

declare module "expect" {
  interface Matchers<R, T> extends OptionMatchers<R, T> {}
}

expect.extend({ toBeSome, toBeNone });
```

```ts title="jest.config.ts" no-twoslash
export default {
  setupFilesAfterEnv: ["./jest.setup.ts"],
};
```

## Assert a Some and its value

To check that a value is a `Some` and assert on its contents in one step, pass a callback to `toBeSome`. The callback parameter is typed as the `Some` value:

```ts no-twoslash
import { Option } from "byenull";
import { expect, test } from "vitest";

import type { OptionMatchers } from "byenull-testing";

declare module "vitest" {
  interface Matchers<R, T> extends OptionMatchers<R, T> {}
}
// ---cut-before---
type User = { id: string; name: string };
const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

test("finds the user", () => {
  const users: User[] = [{ id: "u1", name: "Alice" }];

  expect(findUser("u1", users)).toBeSome((user) => {
    expect(user.name).toBe("Alice"); // user is typed as User
  });
});
```

The callback only runs when the value is a `Some`. A `None` fails the matcher and the callback is skipped.

## Assert a None

To check that a lookup found nothing, use `toBeNone`:

```ts no-twoslash
import { Option } from "byenull";
import { expect, test } from "vitest";

import type { OptionMatchers } from "byenull-testing";

declare module "vitest" {
  interface Matchers<R, T> extends OptionMatchers<R, T> {}
}
// ---cut-before---
type User = { id: string; name: string };
const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

test("finds no user", () => {
  const users: User[] = [];

  expect(findUser("u404", users)).toBeNone();
});
```

## Do not combine the matchers with `.not`

`.not.toBeSome` and `.not.toBeNone` always pass. The matchers are built so that negation is pointless. To assert the opposite outcome, use the other matcher: `toBeSome` for presence, `toBeNone` for absence.
