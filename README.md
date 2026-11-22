<p align="center">
  <a href="https://www.npmjs.com/package/byenull"><img alt="npm version: byenull" src="https://img.shields.io/npm/v/byenull.svg?style=for-the-badge&amp;labelColor=000000" height="28"></a>
  <a href="https://github.com/JohannesKlauss/byenull/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/johannesklauss/byenull.svg?style=for-the-badge&amp;labelColor=000000" height="28"></a>
  <a href="https://www.npmjs.com/package/byenull"><img alt="npm downloads per month: byenull" src="https://img.shields.io/npm/dm/byenull.svg?style=for-the-badge&amp;labelColor=000000&amp;label=npm%20downloads" height="28"></a>
</p>

<p align="center">
  <a aria-label="Sponsored by Spaceteams" href="https://spaceteams.de">
    <img alt="Sponsored by Spaceteams" src="https://raw.githubusercontent.com/spaceteams/badges/main/sponsored-by-spaceteams.svg">
  </a>
</p>

<h1 align="center"><img src="website/docs/public/byenull-icon.svg" alt="" width="48" height="48" align="center"> byenull.</h1>

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
| [`byenull`](packages/byenull) | <a href="https://www.npmjs.com/package/byenull"><img alt="npm version: byenull" src="https://img.shields.io/npm/v/byenull.svg?style=for-the-badge&amp;labelColor=000000" height="28"></a>| Core package |
| [`byenull-testing`](packages/testing) | <a href="https://www.npmjs.com/package/byenull"><img alt="npm version: byenull" src="https://img.shields.io/npm/v/byenull-testing.svg?style=for-the-badge&amp;labelColor=000000" height="28"></a>| Testing matchers |
| [`byenull-oxlint`](packages/oxlint) | <a href="https://www.npmjs.com/package/byenull"><img alt="npm version: byenull" src="https://img.shields.io/npm/v/byenull-oxlint.svg?style=for-the-badge&amp;labelColor=000000" height="28"></a>| Oxlint plugin/preset |

## Contributing

Contributions, issues, and feature requests are welcome. Use the [issues page](https://github.com/JohannesKlauss/byenull/issues) to report a problem or discuss a change.

## License

This project is licensed under the [MIT license](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE).

## Contact

Johannes Klauss - [@JohannesKlauss](https://github.com/JohannesKlauss) - klauss.johannes@gmail.com

Project Link: [https://github.com/JohannesKlauss/byenull](https://github.com/JohannesKlauss/byenull)

## Contributors

<a href="https://github.com/johannesklauss/byenull/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=johannesklauss/byenull" />
</a>
