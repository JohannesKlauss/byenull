import type { z } from "zod";
import { some } from "./functions/some";

/**
 * Creates a native Zod field with a required Option output.
 * Uses native `inner.nullish().transform(some)` composition. Ordinary missing,
 * undefined, and null inputs become None. Explicit inner defaults may run for
 * missing/undefined inputs and their output is wrapped; null retains native
 * nullish behavior. Inner processing follows Zod semantics, not a blanket bypass
 * guarantee. Parsed outputs are wrapped with `some`; nullish outputs become
 * None and existing Options remain nested.
 *
 * Validation issues and callback exceptions retain Zod's native behavior.
 * Use `parseAsync` or `safeParseAsync` for async refinements and transforms.
 * An outer optional wrapper follows Zod semantics and can make output optional.
 * Deliberately Promise-valued payload schemas are not a supported contract.
 *
 * @param inner - The schema for a present value.
 * @returns A native schema producing Option of the non-nullish parsed output.
 * @example
 * ```ts
 * import { z } from "zod";
 * import { option } from "byenull/zod";
 *
 * const User = z.object({ nickname: option(z.string()) });
 * const missing = User.parse({});
 * // { nickname: { type: "None" } }
 * const present = User.parse({ nickname: "Ada" });
 * // { nickname: { type: "Some", value: "Ada" } }
 * ```
 * @category Interop
 */
export function option<S extends z.ZodType>(inner: S) {
  return inner.nullish().transform((value) => some(value));
}
