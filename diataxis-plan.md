# Diátaxis Documentation Plan — byenull

Status: **run complete** (all quadrants written, verified, and committed).
This file is the durable record for future runs.

## Audiences, goals, rationale (user-confirmed)

- Audience: TypeScript application developers — existing `@praha/byethrow`
  users **and** standalone users new to Option types, weighted equally.
- Top real-world goals: make nullable lookups type-safe; compose pipelines
  that mix sync/async; convert Option ⇄ Result at boundaries; assert Options
  in vitest/jest.
- Decisions worth explaining: object-based Option; unified sync/async;
  nullish normalization in `some()`; absence vs failure split; data-last
  curried API composed through `pipe`.

## Standing decisions (bind future runs)

- Output: `website/docs/` (rspress), English only, `base: '/'` (local only —
  add sitemap/OG/base path when a public URL exists).
- Docs examples use the `Option` namespace; `O` is shown as an equal
  shorthand in the import-style guide.
- Code samples are twoslash type-checked; the website depends on workspace
  `byenull`, `byenull-testing`, `@praha/byethrow`, `vitest`, `@jest/globals`,
  and `expect` so every sample compiles. Building docs requires
  `pnpm --filter byenull --filter byenull-testing build` first.
- `docs/api` is generated at dev/build by `website/plugins/typedoc` (ported
  from byethrow, MIT) and gitignored — never edited by hand. The plugin also
  carries a post-processing fix that restores `@example` tags on signature
  comments for overloaded functions (without it, orElse/unwrap lose their
  examples).
- Reference scope (approved): core `byenull` package only; `byenull-testing`
  is documented in the testing how-to page.

## Delivered documents

| Quadrant    | Pages                                                                                                                                                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home        | `docs/index.md`                                                                                                                                                                                                                                                        |
| Tutorials   | `guide/start/` (introduction, why, quick) · `guide/tutorial/` (index, basics: option-type, creating-options, checking-options; transforming: pipe-basics, mapping-options, chaining-options, recovering-options; resolving: unwrapping-options, converting-to-results) |
| How-to      | `guide/how-to/` (index, importing-option, handling-nullish-values, writing-async-pipelines, converting-between-option-and-result, testing-options)                                                                                                                     |
| Reference   | `api/` (typedoc-generated: modules, types, functions) + typedoc JSDoc in `packages/byenull/src` + `packages/byenull/typedoc.json`                                                                                                                                      |
| Explanation | `guide/explanation/` (index, option-vs-null, option-vs-result, sync-and-async, design-principles)                                                                                                                                                                      |

## Code changes shipped alongside (W1–W4)

- W1: `fn(args)` → `fn(...args)` fix + multi-arg tests.
- W2: `pipe` (byethrow-style, 25 steps) + tests.
- W3: `index.ts` JSDoc rewritten with real examples.
- W4 (surfaced by twoslash): `andThen` overload order matched to `orElse`;
  `map` gained byethrow's O-based first overload for unannotated callbacks;
  `toResult`'s nested `convert` overloads swapped (TS uses the last overload
  for contextual typing); `byenull-testing`'s `ResultMatchers` renamed to
  `OptionMatchers`; lint/format debt in both packages cleared.

## Not created (reason + remedy)

1. **Examples section** — no `examples/` projects exist in the repo; the
   tutorial's profile-lookup project substitutes. Remedy: add runnable
   example projects and one examples page per project.
2. **Architecture (C4) explanation page** — no deploy manifests, no external
   systems, no runtime actors; no Container-level evidence for a diagram.
   Remedy: record evidence (deploy manifests, service entry points) if the
   project gains deployable units.
3. **i18n locales** — no translated content, no `i18n.json`. Remedy: add
   locales when translations are contributed.
4. **Linter/ecosystem section** — README mentions a `byenull-oxlint` package
   that does not exist. Remedy: create the package first.
5. **Tutorial "combining" group** — no aggregation helpers (no `combine`,
   `zip`, object-builders). Remedy: add such functions in a future version.

## Tutorial verification status

- **Verified by execution**: every tutorial running-example output was
  executed against the built `dist` and matches the pages' claimed values
  (quick start, pipe basics, short-circuit, recovering, unwrapping,
  async/avatar, converting). All samples additionally type-check via
  twoslash on every website build.
- The `fetch`-based samples were executed against a local stub (no network);
  they are type-verified but their HTTP behavior is unverified.
