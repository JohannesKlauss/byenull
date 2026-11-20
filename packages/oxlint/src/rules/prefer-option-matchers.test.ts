import dedent from "dedent";

import { ruleTester } from "../tester";
import { preferOptionMatchers } from "./prefer-option-matchers";

ruleTester.run("prefer-option-matchers", preferOptionMatchers, {
  valid: [
    // Already using custom matchers
    {
      code: dedent`
          expect(option).toBeSome();
        `,
    },
    {
      code: dedent`
          expect(option).toBeNone();
        `,
    },
    {
      code: dedent`
          expect(option).toBeSome((value) => {});
        `,
    },

    // non-byenull call should not trigger
    {
      code: dedent`
          expect(someValue).toBe(true);
        `,
    },
    {
      code: dedent`
          expect(someValue).toBeTruthy();
        `,
    },
    {
      code: dedent`
          expect(someValue).not.toBe(true);
        `,
    },
    {
      code: dedent`
          expect(isSome(option)).toBe(true);
        `,
    },
    {
      code: dedent`
          expect(isSome(option)).toBe(false);
        `,
    },
    {
      code: dedent`
          expect(isNone(option)).toBeTruthy();
        `,
    },
    {
      code: dedent`
          expect(isNone(option)).toBeFalsy();
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          expect(Option.isSome(option)).toBe(true);
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          expect(Option.isSome(option)).not.toBe(false);
        `,
    },
    {
      code: dedent`
          import { O } from "other-package";

          expect(O.isNone(option)).toBeTruthy();
        `,
    },
    {
      code: dedent`
          import { O } from "other-package";

          expect(O.isNone(option)).toBeFalsy();
        `,
    },

    // assert with non-byenull call should not trigger
    {
      code: dedent`
          assert(isSome(option));
        `,
    },
    {
      code: dedent`
          assert(isNone(option));
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          assert(Option.isSome(option));
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          assert(Option.isNone(option));
        `,
    },

    // non-byenull unwrap should not trigger
    {
      code: dedent`
          unwrap(option);
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          Option.unwrap(option);
        `,
    },
  ],
  invalid: [
    // expect(...).toBe(true)
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isSome(option)).toBe(true);
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeSome();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeSome()` instead of `expect(Option.isSome(option)).toBe(true)`.",
          line: 3,
          column: 0,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          expect(O.isSome(option)).toBe(true);
        `,
      output: dedent`
          import { O } from "byenull";

          expect(option).toBeSome();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeSome()` instead of `expect(O.isSome(option)).toBe(true)`.",
          line: 3,
          column: 0,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isNone(option)).toBe(true);
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeNone();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeNone()` instead of `expect(Option.isNone(option)).toBe(true)`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // expect(...).not.toBe(true)
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isSome(option)).not.toBe(true);
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeNone();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeNone()` instead of `expect(Option.isSome(option)).not.toBe(true)`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // expect(...).toBe(false)
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isSome(option)).toBe(false);
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeNone();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeNone()` instead of `expect(Option.isSome(option)).toBe(false)`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // expect(...).not.toBe(false)
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isNone(option)).not.toBe(false);
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeNone();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeNone()` instead of `expect(Option.isNone(option)).not.toBe(false)`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // expect(...).toBeTruthy()
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isSome(option)).toBeTruthy();
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeSome();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeSome()` instead of `expect(Option.isSome(option)).toBeTruthy()`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // expect(...).not.toBeTruthy()
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isSome(option)).not.toBeTruthy();
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeNone();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeNone()` instead of `expect(Option.isSome(option)).not.toBeTruthy()`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // expect(...).toBeFalsy()
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isNone(option)).toBeFalsy();
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeSome();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeSome()` instead of `expect(Option.isNone(option)).toBeFalsy()`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // expect(...).not.toBeFalsy()
    {
      code: dedent`
          import { Option } from "byenull";

          expect(Option.isNone(option)).not.toBeFalsy();
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeNone();
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeNone()` instead of `expect(Option.isNone(option)).not.toBeFalsy()`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // assert(...)
    {
      code: dedent`
          import { Option } from "byenull";

          assert(Option.isSome(option));
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeSome((value) => {});
        `,
      errors: [
        {
          message: "Use `expect(option).toBeSome()` instead of `assert(Option.isSome(option))`.",
          line: 3,
          column: 0,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          assert(O.isSome(option));
        `,
      output: dedent`
          import { O } from "byenull";

          expect(option).toBeSome((value) => {});
        `,
      errors: [
        {
          message: "Use `expect(option).toBeSome()` instead of `assert(O.isSome(option))`.",
          line: 3,
          column: 0,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          assert(Option.isNone(option));
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeNone();
        `,
      errors: [
        {
          message: "Use `expect(option).toBeNone()` instead of `assert(Option.isNone(option))`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // Option.unwrap(...)
    {
      code: dedent`
          import { Option } from "byenull";

          Option.unwrap(option);
        `,
      output: dedent`
          import { Option } from "byenull";

          expect(option).toBeSome((value) => {});
        `,
      errors: [
        {
          message:
            "Use `expect(option).toBeSome((value) => {})` instead of `Option.unwrap(option)`.",
          line: 3,
          column: 0,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          O.unwrap(option);
        `,
      output: dedent`
          import { O } from "byenull";

          expect(option).toBeSome((value) => {});
        `,
      errors: [
        {
          message: "Use `expect(option).toBeSome((value) => {})` instead of `O.unwrap(option)`.",
          line: 3,
          column: 0,
        },
      ],
    },
  ],
});
