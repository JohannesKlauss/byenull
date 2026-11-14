---
pageType: home

titleSuffix: A lightweight Option type library
description: A lightweight, tree-shakable Option type library for type-safe nullable handling in TypeScript.

hero:
  name: byenull
  text: A lightweight Option type package
  tagline: Say goodbye to null and undefined
  actions:
    - theme: brand
      text: Introduction
      link: ./guide/start/introduction
    - theme: alt
      text: Quick start
      link: ./guide/start/quick
    - theme: alt
      text: GitHub
      link: https://github.com/JohannesKlauss/byenull

features:
  - icon: 🌲
    title: Tree-shakable
    details: Every function is an independent export, so your bundle only includes what you use.
    link: ./guide/start/introduction
  - icon: 🧱
    title: Plain objects
    details: An Option is a plain object, not a class instance, so it logs, serializes, and diffs like any other value.
    link: ./guide/tutorial/basics/option-type
  - icon: 🔀
    title: One API for sync and async
    details: Every function accepts both Option and Promise of Option. There are no separate async functions.
    link: ./guide/explanation/sync-and-async
  - icon: 🔗
    title: Composable pipelines
    details: Build readable top-to-bottom pipelines with pipe, map, andThen, and orElse.
    link: ./guide/tutorial/transforming/pipe-basics
  - icon: 🤝
    title: byethrow interop
    details: Convert between Option and Result with toResult and fromResult, built to pair with byethrow.
    link: ./guide/tutorial/resolving/converting-to-results
  - icon: 🎯
    title: Fully type-safe
    details: Value types are inferred through every step of a pipeline, covered by type tests.
    link: ./api/modules/Option
---
