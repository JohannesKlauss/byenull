import * as v from "valibot";
import { some } from "./functions/some";
import type { Option } from "./option";

/**
 * Creates a native Valibot field with a required Option output.
 * Missing, undefined, and null inputs become None through a native nullish
 * wrapper. The wrapper's default factory materializes omitted object entries;
 * it bypasses inner defaults, checks, and transformations for nullish input.
 * Present values are validated before wrapping with `some`. Nullish parsed
 * outputs become None; existing Options stay nested.
 *
 * Sync schemas stay sync. Async schemas require an async parent and parser,
 * such as `objectAsync` and `parseAsync`. Native issues, throws, and rejections
 * are not converted to None. Outer optional wrappers follow Valibot semantics.
 * Deliberately Promise-valued payload schemas are outside the tested contract.
 *
 * @param inner - The schema for a present value.
 * @returns A mode-preserving native schema wrapping its non-nullish output.
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { option } from "byenull/valibot";
 *
 * const User = v.object({ nickname: option(v.string()) });
 * const missing = v.parse(User, {});
 * // { nickname: { type: "None" } }
 * const present = v.parse(User, { nickname: "Ada" });
 * // { nickname: { type: "Some", value: "Ada" } }
 * ```
 * @category Interop
 */
export function option<S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  inner: S,
): v.SchemaWithPipe<
  readonly [
    v.NullishSchema<S, () => undefined>,
    v.TransformAction<v.InferOutput<S> | null | undefined, Option<NonNullable<v.InferOutput<S>>>>,
  ]
>;
export function option<S extends v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>>(
  inner: S,
): v.SchemaWithPipeAsync<
  readonly [
    v.NullishSchemaAsync<S, () => undefined>,
    v.TransformAction<v.InferOutput<S> | null | undefined, Option<NonNullable<v.InferOutput<S>>>>,
  ]
>;
export function option<
  S extends
    | v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
    | v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>,
>(
  inner: S,
): S extends { readonly async: true }
  ? v.SchemaWithPipeAsync<
      readonly [
        v.NullishSchemaAsync<S, () => undefined>,
        v.TransformAction<
          v.InferOutput<S> | null | undefined,
          Option<NonNullable<v.InferOutput<S>>>
        >,
      ]
    >
  : v.SchemaWithPipe<
      readonly [
        v.NullishSchema<
          Extract<S, v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>,
          () => undefined
        >,
        v.TransformAction<
          v.InferOutput<S> | null | undefined,
          Option<NonNullable<v.InferOutput<S>>>
        >,
      ]
    >;
export function option(
  inner:
    | v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
    | v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>,
) {
  return inner.async
    ? v.pipeAsync(
        v.nullishAsync(inner, () => undefined),
        v.transform(some),
      )
    : v.pipe(
        v.nullish(inner, () => undefined),
        v.transform(some),
      );
}
