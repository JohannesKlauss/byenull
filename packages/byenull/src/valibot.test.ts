import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import * as v from "valibot";
import { some } from "./functions/some";
import type { Option } from "./option";
import { option } from "./valibot";

describe("Valibot option field", () => {
  const User = v.object({ nickname: option(v.string()) });

  it.each([{}, { nickname: undefined }, { nickname: null }])(
    "materializes an own key for %j",
    (input) => {
      const output = v.parse(User, input);
      expect(output).toEqual({ nickname: some(null) });
      expect(Object.hasOwn(output, "nickname")).toBe(true);
    },
  );

  it("stays sync and preserves falsy present values", async () => {
    const field = option(v.string());
    expect(field.async).toBe(false);
    expectTypeOf(field.async).toEqualTypeOf<false>();
    const Schema = v.object({ text: field, count: option(v.number()), flag: option(v.boolean()) });
    const output = v.parse(Schema, { text: "", count: 0, flag: false });
    expect(output).toEqual({ text: some(""), count: some(0), flag: some(false) });
    expectTypeOf(output).toEqualTypeOf<{
      text: Option<string>;
      count: Option<number>;
      flag: Option<boolean>;
    }>();
    expect(await v.parseAsync(v.objectAsync({ value: field }), {})).toEqual({ value: some(null) });
    expect(await v.parseAsync(v.objectAsync({ value: field }), { value: "Ada" })).toEqual({
      value: some("Ada"),
    });
  });

  it("preserves native validation issues and nested array/object paths", () => {
    const Schema = v.object({ users: v.array(User) });
    const result = v.safeParse(Schema, { users: [{ nickname: 42 }] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0].type).toBe("string");
      expect(result.issues[0].path?.map((item) => item.key)).toEqual(["users", 0, "nickname"]);
    }
    expect(() => v.parse(User, { nickname: false })).toThrow(v.ValiError);
    expectTypeOf<v.InferIssue<typeof User>>().toEqualTypeOf<v.ObjectIssue | v.StringIssue>();
  });

  it("uses native nullish bypass separately from inner checks and coercion", () => {
    const check = vi.fn((s: string) => s.length > 0);
    const coerce = vi.fn((input: unknown) => String(input));
    const Schema = v.object({
      checked: option(v.pipe(v.string(), v.check(check))),
      coerced: option(v.pipe(v.unknown(), v.transform(coerce))),
    });
    for (const input of [
      {},
      { checked: undefined, coerced: undefined },
      { checked: null, coerced: null },
    ]) {
      expect(v.parse(Schema, input)).toEqual({ checked: some(null), coerced: some(null) });
    }
    expect(check).not.toHaveBeenCalled();
    expect(coerce).not.toHaveBeenCalled();
    expect(v.parse(Schema, { checked: "Ada", coerced: 12 })).toEqual({
      checked: some("Ada"),
      coerced: some("12"),
    });
    expect(check).toHaveBeenCalledOnce();
    expect(coerce).toHaveBeenCalledOnce();
  });

  it("retains Valibot nullish behavior rather than forcing inner defaults to run", () => {
    const fallback = vi.fn(() => "Guest");
    const Schema = v.object({ value: option(v.optional(v.string(), fallback)) });
    for (const input of [{}, { value: undefined }, { value: null }]) {
      expect(v.parse(Schema, input)).toEqual({ value: some(null) });
    }
    expect(fallback).not.toHaveBeenCalled();
    expect(v.parse(Schema, { value: "Ada" })).toEqual({ value: some("Ada") });
    // The inner default itself works when parsed without an outer nullish wrapper.
    expect(v.parse(v.optional(v.string(), fallback), undefined)).toBe("Guest");
    expect(fallback).toHaveBeenCalledOnce();
  });

  it("normalizes nullish transformed output and preserves nested Options", () => {
    const Schema = v.object({
      length: option(
        v.pipe(
          v.string(),
          v.transform((s) => s.length),
        ),
      ),
      nil: option(
        v.pipe(
          v.string(),
          v.transform(() => null),
        ),
      ),
      undef: option(
        v.pipe(
          v.string(),
          v.transform(() => undefined),
        ),
      ),
      nested: option(v.pipe(v.string(), v.transform(some))),
    });
    expect(v.parse(Schema, { length: "Ada", nil: "x", undef: "x", nested: "Ada" })).toEqual({
      length: some(3),
      nil: some(null),
      undef: some(undefined),
      nested: some(some("Ada")),
    });
    expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<{
      length: Option<number>;
      nil: Option<never>;
      undef: Option<never>;
      nested: Option<Option<string>>;
    }>();
  });

  it("preserves literal/union input and required output inference", () => {
    expectTypeOf<v.InferInput<typeof User>>().toEqualTypeOf<{
      nickname?: string | null | undefined;
    }>();
    expectTypeOf<v.InferOutput<typeof User>>().toEqualTypeOf<{ nickname: Option<string> }>();
    const Schema = v.object({ value: option(v.union([v.literal("Ada"), v.literal(0)])) });
    expectTypeOf<v.InferInput<typeof Schema>>().toEqualTypeOf<{
      value?: "Ada" | 0 | null | undefined;
    }>();
    expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<{ value: Option<"Ada" | 0> }>();
    expect(v.parse(Schema, { value: 0 })).toEqual({ value: some(0) });
  });

  it("propagates sync callback throws through safe parsing", () => {
    const error = new Error("callback failed");
    const transform = vi.fn(() => {
      throw error;
    });
    const Schema = v.object({ value: option(v.pipe(v.string(), v.transform(transform))) });
    expect(v.parse(Schema, {})).toEqual({ value: some(null) });
    expect(transform).not.toHaveBeenCalled();
    expect(() => v.safeParse(Schema, { value: "Ada" })).toThrow(error);
  });

  it("awaits async transforms and materializes omitted fields", async () => {
    const transform = vi.fn(async (s: string) => s.length);
    const inner = v.pipeAsync(v.string(), v.transformAsync(transform));
    const field = option(inner);
    expect(field.async).toBe(true);
    expectTypeOf(field.async).toEqualTypeOf<true>();
    expectTypeOf<v.InferIssue<typeof field>>().toEqualTypeOf<v.InferIssue<typeof inner>>();
    const Schema = v.objectAsync({ value: field });
    for (const input of [{}, { value: undefined }, { value: null }]) {
      const output = await v.parseAsync(Schema, input);
      expect(output).toEqual({ value: some(null) });
      expect(Object.hasOwn(output, "value")).toBe(true);
    }
    expect(transform).not.toHaveBeenCalled();
    const output = await v.parseAsync(Schema, { value: "Ada" });
    expect(output).toEqual({ value: some(3) });
    expectTypeOf(output).toEqualTypeOf<{ value: Option<number> }>();
    expect((await v.safeParseAsync(Schema, { value: 42 })).success).toBe(false);
    expect((await v.safeParseAsync(Schema, { value: "Ada" })).success).toBe(true);
  });

  it("preserves async check issues and array paths", async () => {
    const check = vi.fn(async (s: string) => s.length > 2);
    const inner = v.pipeAsync(v.string(), v.checkAsync(check, "too short"));
    const field = option(inner);
    expectTypeOf<v.InferIssue<typeof field>>().toEqualTypeOf<v.InferIssue<typeof inner>>();
    const Schema = v.objectAsync({ values: v.arrayAsync(field) });
    expect(await v.parseAsync(Schema, { values: [null, undefined] })).toEqual({
      values: [some(null), some(null)],
    });
    expect(check).not.toHaveBeenCalled();
    const result = await v.safeParseAsync(Schema, { values: ["x"] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0].message).toBe("too short");
      expect(result.issues[0].path?.map((item) => item.key)).toEqual(["values", 0]);
    }
    expect(await v.parseAsync(Schema, { values: ["Ada"] })).toEqual({ values: [some("Ada")] });
  });

  it("normalizes resolved async payloads and bypasses async inner defaults", async () => {
    const fallback = vi.fn(async () => "Guest");
    const Schema = v.objectAsync({
      nil: option(
        v.pipeAsync(
          v.string(),
          v.transformAsync(async () => null),
        ),
      ),
      nested: option(
        v.pipeAsync(
          v.string(),
          v.transformAsync(async (s) => some(s)),
        ),
      ),
      defaulted: option(v.optionalAsync(v.string(), fallback)),
    });
    expect(await v.parseAsync(Schema, { nil: "x", nested: "Ada" })).toEqual({
      nil: some(null),
      nested: some(some("Ada")),
      defaulted: some(null),
    });
    expect(fallback).not.toHaveBeenCalled();
    expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<{
      nil: Option<never>;
      nested: Option<Option<string>>;
      defaulted: Option<string>;
    }>();
  });

  it("propagates async transform and check rejections", async () => {
    const error = new Error("async callback failed");
    for (const inner of [
      v.pipeAsync(
        v.string(),
        v.transformAsync(async () => {
          throw error;
        }),
      ),
      v.pipeAsync(
        v.string(),
        v.checkAsync(async () => {
          throw error;
        }),
      ),
    ]) {
      const Schema = v.objectAsync({ value: option(inner) });
      expect(await v.parseAsync(Schema, {})).toEqual({ value: some(null) });
      await expect(v.parseAsync(Schema, { value: "Ada" })).rejects.toBe(error);
      await expect(v.safeParseAsync(Schema, { value: "Ada" })).rejects.toBe(error);
    }
  });
});
