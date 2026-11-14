---
pageType: home

titleSuffix: Option types for TypeScript
description: An Option type for TypeScript with synchronous and asynchronous pipelines and conversions for @praha/byethrow.

hero:
  name: byenull
  text: An Option type package
  tagline: Represent values that may be absent
  actions:
    - theme: brand
      text: Introduction
      link: ./guide/start/introduction
    - theme: alt
      text: Quick start
      link: ./guide/start/quick

features:
  - title: Absence in the type
    details: Some carries a value and None carries no value. Function signatures show when a result may be absent.
    link: ./guide/start/introduction
  - title: Plain objects
    details: Options have a type field and an optional value field. Log, serialize, and compare them without class instances.
    link: ./guide/start/introduction
  - title: Promise-aware pipelines
    details: map, andThen, orElse, unwrap, and the Result converters accept Options and Promises of Options.
    link: ./guide/start/quick
  - title: Composable steps
    details: pipe connects lookups, synchronous transforms, and fallbacks. None skips later value-side operations.
    link: ./guide/tutorial/transforming/pipe-basics
  - title: byethrow conversions
    details: Use toResult(error) when None needs an error. fromResult turns Failure into None and discards its error.
    link: ./guide/start/why
  - title: Two import namespaces
    details: Import Option or its shorter alias O. Both expose the same constructors, guards, and combinators.
    link: ./guide/start/quick
---
