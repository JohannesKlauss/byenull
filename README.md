<div align="center">

[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE)

[Documentation](https://praha-inc.github.io/byethrow/) · [Quick Start](https://praha-inc.github.io/byethrow/guide/start/quick) · [Examples](https://praha-inc.github.io/byethrow/examples/parse-package-json) · [API Reference](https://praha-inc.github.io/byethrow/api/modules/Result)

</div>

## Introduction

`byenull` is a lightweight, tree-shakable Option type package with a simple, consistent API designed to handle nullable operations in JavaScript and TypeScript. It provides a straightforward way to manage null and undefined without the complexity of larger libraries. For a usage guide, visit the [official documentation](https://praha-inc.github.io/byethrow/).

It is designed to act as a companion library for the excellent [@praha-inc/byethrow](https://github.com/praha-inc/byethrow) library. It closely follows it's API design and provides helper functions to transform Option types into Result types and vice versa.

Although it is recommended to use `byethrow` and `byenull` side by side, you can certainly use `byenull` standalone.

## Structure

| Package Name                                  | Version                                                                                                                         | Description           | Changelog                                   |
|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|-----------------------|---------------------------------------------|
| [`byenull`](packages/byethrow)        | [![npm version](https://badge.fury.io/js/byenull.svg)](https://www.npmjs.com/package/byenull)                 | Core package          | [CHANGELOG](packages/byenull/CHANGELOG.md) |
| [`byenull-docs`](packages/docs)       | [![npm version](https://badge.fury.io/js/byenull-docs.svg)](https://www.npmjs.com/package/byenull-docs)       | Documentation package | [CHANGELOG](packages/docs/CHANGELOG.md)     |
| [`byenull-oxlint`](packages/oxlint)   | [![npm version](https://badge.fury.io/js/byenull-oxlint.svg)](https://www.npmjs.com/package/byenull-oxlint)   | Oxlint plugin package | [CHANGELOG](packages/oxlint/CHANGELOG.md)   |
| [`byenull-testing`](packages/testing) | [![npm version](https://badge.fury.io/js/byenull-testing.svg)](https://www.npmjs.com/package/byenull-testing) | Testing package       | [CHANGELOG](packages/testing/CHANGELOG.md)  |

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to check [issues page](https://github.com/JohannesKlauss/byenull/issues) if you want to contribute.

## 📝 License

This project is [```MIT```](https://github.com/JohannesKlauss/byenull/blob/main/LICENSE) licensed.