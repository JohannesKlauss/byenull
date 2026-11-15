<div align="center">

[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE)

</div>

## Introduction

`byenull` provides an Option type for JavaScript and TypeScript. It represents a value as `Some` or `None` and includes functions for creating, transforming, and checking Option values.

It complements [@praha-inc/byethrow](https://github.com/praha-inc/byethrow), follows its API design, and includes helpers for converting between Option and Result types. You can use `byenull` with `byethrow` or on its own.

## Quick example

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
type Article = { title: string; author: User };

const alice: User = { id: "u123", name: "Alice" };
const users: User[] = [alice];
const articles: Article[] = [{ title: "Working with Option", author: alice }];

const findUser = Option.fn((id: string, users: User[]) => users.find((user) => user.id === id));

const findArticleByUserName = Option.fn((userName: string, articles: Article[]) =>
  articles.find((article) => article.author.name === userName),
);

const article = Option.pipe(
  Option.some("u123"),
  Option.andThen((id) => findUser(id, users)),
  Option.map((user) => user.name),
  Option.andThen((name) => findArticleByUserName(name, articles)),
);

if (Option.isSome(article)) {
  console.log(article.value);
}
```

## Structure

| Package | Version | Description |
| --- | --- | --- |
| [`byenull`](packages/byenull) | [![npm version](https://badge.fury.io/js/byenull.svg)](https://www.npmjs.com/package/byenull) | Core package |
| [`byenull-testing`](packages/testing) | [![npm version](https://badge.fury.io/js/byenull-testing.svg)](https://www.npmjs.com/package/byenull-testing) | Testing matchers |
| [`byenull-website`](website) | Private | Documentation website |

## Documentation

The documentation lives in [`website/`](website) and follows the [Diátaxis](https://diataxis.fr/) method. Run it locally with:

```bash
pnpm install
pnpm --filter byenull --filter byenull-testing build
pnpm --dir website dev
```

- [Getting started](website/docs/guide/start/introduction.md) explains what byenull is and how to use its core workflow.
- The [tutorial](website/docs/guide/tutorial/basics/option-type.md) builds a profile lookup with the core functions.
- [How-to guides](website/docs/guide/how-to/importing-option.md) cover nullish sources, async pipelines, byethrow interoperability, and testing.
- [Explanation](website/docs/guide/explanation/option-vs-nullish.md) discusses the Option type, sync and async pipelines, and design decisions.
- The [API reference](website/docs/api) is generated from source with TypeDoc on every website build.

## Contributing

Contributions, issues, and feature requests are welcome. Use the [issues page](https://github.com/JohannesKlauss/byenull/issues) to report a problem or discuss a change.

## License

This project is licensed under the [MIT license](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE).
