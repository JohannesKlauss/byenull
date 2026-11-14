<div align="center">

[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE)

</div>

## Introduction

`byenull` is a lightweight, tree-shakable Option type package with a simple, consistent API designed to handle nullable operations in JavaScript and TypeScript. It provides a straightforward way to manage null and undefined without the complexity of larger libraries.

It is designed to act as a companion library for the excellent [@praha-inc/byethrow](https://github.com/praha-inc/byethrow) library. It closely follows its API design and provides helper functions to transform Option types into Result types and vice versa.

Although it is recommended to use `byethrow` and `byenull` side by side, you can certainly use `byenull` standalone.

## Quick Example

```ts
import { Option } from "byenull";

type User = { id: string; name: string };
type Article = { title: string; author: User };

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

| Package                               | Version                                                                                                       | Description           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------- |
| [`byenull`](packages/byenull)         | [![npm version](https://badge.fury.io/js/byenull.svg)](https://www.npmjs.com/package/byenull)                 | Core package          |
| [`byenull-testing`](packages/testing) | [![npm version](https://badge.fury.io/js/byenull-testing.svg)](https://www.npmjs.com/package/byenull-testing) | Testing matchers      |
| [`byenull-website`](website)          | —                                                                                                             | Documentation website |

## Documentation

The documentation lives in [`website/`](website) and follows the [Diátaxis](https://diataxis.fr/) method. Run it locally with:

```bash
pnpm install
pnpm --filter byenull --filter byenull-testing build
pnpm --dir website dev
```

- **[Getting Started](website/docs/guide/start/introduction.md)** — what byenull is and how to run its core workflow in minutes
- **[Tutorial](website/docs/guide/tutorial/index.mdx)** — a step-by-step lesson that builds a profile lookup with every function
- **[How-To Guides](website/docs/guide/how-to/index.mdx)** — recipes for real-world tasks: nullish sources, async pipelines, byethrow interop, testing
- **[Explanation](website/docs/guide/explanation/index.mdx)** — the reasoning behind the Option type, the sync/async model, and the library's design
- **[API Reference](website/docs/api)** — generated from the source with typedoc on every website build

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to check [issues page](https://github.com/JohannesKlauss/byenull/issues) if you want to contribute.

## 📝 License

This project is [`MIT`](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE) licensed.
