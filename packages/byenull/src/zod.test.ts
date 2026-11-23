import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import { z } from "zod";
import { some } from "./functions/some";
import type { Option } from "./option";
import { option } from "./zod";

describe("Zod option field", () => {
  const User = z.object({ nickname: option(z.string()) });

  it.each([{}, { nickname: undefined }, { nickname: null }])(
    "materializes an own required key for %j",
    (input) => {
      const output = User.parse(input);
      expect(output).toEqual({ nickname: { type: "None" } });
      expect(Object.hasOwn(output, "nickname")).toBe(true);
    },
  );

  it("preserves valid falsy values synchronously", () => {
    const Schema = z.object({
      text: option(z.string()),
      count: option(z.number()),
      flag: option(z.boolean()),
    });
    expect(Schema.parse({ text: "", count: 0, flag: false })).toEqual({
      text: some(""),
      count: some(0),
      flag: some(false),
    });
  });

  it("preserves native failures and nested object/array issue paths", () => {
    const Schema = z.object({ users: z.array(User) });
    const result = Schema.safeParse({ users: [{ nickname: 42 }] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
      expect(result.error.issues[0]?.path).toEqual(["users", 0, "nickname"]);
      expect(result.error.issues[0]?.code).toBe("invalid_type");
    }
    expect(() => User.parse({ nickname: false })).toThrow(z.ZodError);
  });

  it("bypasses ordinary refinements and coercions for nullish inputs", () => {
    const refinement = vi.fn(() => true);
    const coercion = vi.fn((value: unknown) => String(value));
    const Schema = z.object({
      refined: option(z.string().refine(refinement)),
      coerced: option(z.preprocess(coercion, z.coerce.string())),
    });
    for (const input of [
      {},
      { refined: undefined, coerced: undefined },
      { refined: null, coerced: null },
    ]) {
      expect(Schema.parse(input)).toEqual({
        refined: some(null),
        coerced: some(null),
      });
    }
    expect(refinement).not.toHaveBeenCalled();
    expect(coercion).not.toHaveBeenCalled();
    expect(Schema.parse({ refined: "yes", coerced: 12 })).toEqual({
      refined: some("yes"),
      coerced: some("12"),
    });
    expect(refinement).toHaveBeenCalledOnce();
    expect(coercion).toHaveBeenCalledOnce();
  });

  it("wraps explicitly requested native defaults for omission/undefined but not null", () => {
    const fallback = vi.fn(() => "fallback");
    const Schema = z.object({ value: option(z.string().default(fallback)) });
    for (const input of [{}, { value: undefined }]) {
      expect(Schema.parse(input)).toEqual({ value: some("fallback") });
    }
    expect(fallback).toHaveBeenCalledTimes(2);
    expect(Schema.parse({ value: null })).toEqual({ value: some(null) });
    expect(Schema.parse({ value: "given" })).toEqual({ value: some("given") });
    expect(fallback).toHaveBeenCalledTimes(2);
    expectTypeOf<z.output<typeof Schema>>().toEqualTypeOf<{ value: Option<string> }>();
  });

  it("retains native default validation and transform ordering", () => {
    const refine = vi.fn((value: string) => value.length > 2);
    const transform = vi.fn((value: string) => value.length);
    const inner = z.string().refine(refine).transform(transform).default(8);
    const Schema = z.object({ value: option(inner) });
    // Zod defaults are output values; they do not rerun the inner pipeline.
    expect(Schema.parse({})).toEqual({ value: some(8) });
    expect(refine).not.toHaveBeenCalled();
    expect(transform).not.toHaveBeenCalled();
    expect(Schema.parse({ value: "Ada" })).toEqual({ value: some(3) });
    expect(refine).toHaveBeenCalledOnce();
    expect(transform).toHaveBeenCalledOnce();
    expect(Schema.safeParse({ value: "x" }).success).toBe(false);
    expect(Schema.parse({ value: null })).toEqual({ value: some(null) });
    expectTypeOf<z.output<typeof Schema>>().toEqualTypeOf<{ value: Option<number> }>();
  });

  it("normalizes transformed nullish output without flattening Options", () => {
    const Schema = z.object({
      length: option(z.string().transform((s) => s.length)),
      nil: option(z.string().transform(() => null)),
      undef: option(z.string().transform(() => undefined)),
      nested: option(z.string().transform(some)),
    });
    expect(Schema.parse({ length: "Ada", nil: "x", undef: "x", nested: "Ada" })).toEqual({
      length: some(3),
      nil: some(null),
      undef: some(undefined),
      nested: some(some("Ada")),
    });
    expectTypeOf<z.output<typeof Schema>>().toEqualTypeOf<{
      length: Option<number>;
      nil: Option<never>;
      undef: Option<never>;
      nested: Option<Option<string>>;
    }>();
  });

  it("propagates synchronous callback throws, even through safeParse", () => {
    const error = new Error("callback failed");
    const Schema = z.object({
      value: option(
        z.string().transform(() => {
          throw error;
        }),
      ),
    });
    expect(() => Schema.safeParse({ value: "present" })).toThrow(error);
    expect(Schema.parse({})).toEqual({ value: some(undefined) });
  });

  it("awaits native async transforms and bypasses them for absence", async () => {
    const transform = vi.fn(async (s: string) => s.length);
    const Schema = z.object({ value: option(z.string().transform(transform)) });
    for (const input of [{}, { value: null }, { value: undefined }]) {
      const output = await Schema.parseAsync(input);
      expect(output).toEqual({ value: some(undefined) });
      expect(Object.hasOwn(output, "value")).toBe(true);
    }
    expect(transform).not.toHaveBeenCalled();
    const output = await Schema.parseAsync({ value: "Ada" });
    expect(output).toEqual({ value: some(3) });
    expectTypeOf(output).toEqualTypeOf<{ value: Option<number> }>();
    expect(await Schema.safeParseAsync({ value: "Ada" })).toEqual({ success: true, data: output });
    expect((await Schema.safeParseAsync({ value: 1 })).success).toBe(false);
    expect(() => Schema.parse({ value: "Ada" })).toThrow();
  });

  it("retains async refinement issues and field paths", async () => {
    const refine = vi.fn(async (s: string) => s.length > 2);
    const Schema = z.object({ values: z.array(option(z.string().refine(refine, "too short"))) });
    expect(await Schema.parseAsync({ values: [null, undefined] })).toEqual({
      values: [some(null), some(undefined)],
    });
    expect(refine).not.toHaveBeenCalled();
    const result = await Schema.safeParseAsync({ values: ["x"] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["values", 0], message: "too short" });
    }
    expect(await Schema.parseAsync({ values: ["Ada"] })).toEqual({ values: [some("Ada")] });
  });

  it("propagates async callback rejections instead of returning None", async () => {
    const error = new Error("async callback failed");
    const Schema = z.object({
      value: option(
        z.string().transform(async () => {
          throw error;
        }),
      ),
    });
    await expect(Schema.parseAsync({ value: "present" })).rejects.toBe(error);
    await expect(Schema.safeParseAsync({ value: "present" })).rejects.toBe(error);
    expect(await Schema.parseAsync({})).toEqual({ value: some(undefined) });
  });

  it("awaits native transforms following an explicitly requested default", async () => {
    const transform = vi.fn(async (value: string) => value.length);
    const Schema = z.object({ value: option(z.string().default("fallback").transform(transform)) });
    for (const input of [{}, { value: undefined }]) {
      expect(await Schema.parseAsync(input)).toEqual({ value: some(8) });
    }
    expect(transform).toHaveBeenCalledTimes(2);
    expect(await Schema.parseAsync({ value: null })).toEqual({ value: some(null) });
    expect(transform).toHaveBeenCalledTimes(2);
    expectTypeOf<z.output<typeof Schema>>().toEqualTypeOf<{ value: Option<number> }>();
  });

  it("infers optional nullish input and required literal/union output", () => {
    expectTypeOf<z.input<typeof User>>().toEqualTypeOf<{ nickname?: string | null | undefined }>();
    expectTypeOf<z.output<typeof User>>().toEqualTypeOf<{ nickname: Option<string> }>();
    const Schema = z.object({ value: option(z.union([z.literal("Ada"), z.literal(0)])) });
    expectTypeOf<z.output<typeof Schema>>().toEqualTypeOf<{ value: Option<"Ada" | 0> }>();
    expectTypeOf<z.input<typeof Schema>>().toEqualTypeOf<{
      value?: "Ada" | 0 | null | undefined;
    }>();
  });
});
