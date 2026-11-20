import dedent from "dedent";

import { ruleTester } from "../tester";
import { noNegatedTypeGuards } from "./no-negated-type-guards";

ruleTester.run("no-negated-type-guards", noNegatedTypeGuards, {
  valid: [
    // Not using negation
    {
      code: dedent`
          import { Option } from "byenull";

          Option.isSome(option);
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          Option.isNone(option);
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          O.isSome(option);
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          O.isNone(option);
        `,
    },

    // Other type guards should not trigger
    {
      code: dedent`
          import { Option } from "byenull";

          !Option.isOption(option);
        `,
    },

    // Non-byenull calls should not trigger
    {
      code: dedent`
          !isSome(option);
        `,
    },
    {
      code: dedent`
          !isNone(option);
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          !Option.isSome(option);
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          !Option.isNone(option);
        `,
    },
  ],
  invalid: [
    // !Option.isSome(option)
    {
      code: dedent`
          import { Option } from "byenull";

          !Option.isSome(option)
        `,
      output: dedent`
          import { Option } from "byenull";

          Option.isNone(option)
        `,
      errors: [
        {
          message: "Use `Option.isNone(option)` instead of `!Option.isSome(option)`.",
          line: 3,
          column: 0,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          !O.isSome(option)
        `,
      output: dedent`
          import { O } from "byenull";

          O.isNone(option)
        `,
      errors: [
        {
          message: "Use `O.isNone(option)` instead of `!O.isSome(option)`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // !Option.isNone(option)
    {
      code: dedent`
          import { Option } from "byenull";

          !Option.isNone(option)
        `,
      output: dedent`
          import { Option } from "byenull";

          Option.isSome(option)
        `,
      errors: [
        {
          message: "Use `Option.isSome(option)` instead of `!Option.isNone(option)`.",
          line: 3,
          column: 0,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          !O.isNone(option)
        `,
      output: dedent`
          import { O } from "byenull";

          O.isSome(option)
        `,
      errors: [
        {
          message: "Use `O.isSome(option)` instead of `!O.isNone(option)`.",
          line: 3,
          column: 0,
        },
      ],
    },

    // used in if condition
    {
      code: dedent`
          import { Option } from "byenull";

          if (!Option.isSome(option)) {}
        `,
      output: dedent`
          import { Option } from "byenull";

          if (Option.isNone(option)) {}
        `,
      errors: [
        {
          message: "Use `Option.isNone(option)` instead of `!Option.isSome(option)`.",
          line: 3,
          column: 4,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          if (!O.isSome(option)) {}
        `,
      output: dedent`
          import { O } from "byenull";

          if (O.isNone(option)) {}
        `,
      errors: [
        {
          message: "Use `O.isNone(option)` instead of `!O.isSome(option)`.",
          line: 3,
          column: 4,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          if (!Option.isNone(option)) {}
        `,
      output: dedent`
          import { Option } from "byenull";

          if (Option.isSome(option)) {}
        `,
      errors: [
        {
          message: "Use `Option.isSome(option)` instead of `!Option.isNone(option)`.",
          line: 3,
          column: 4,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          if (!O.isNone(option)) {}
        `,
      output: dedent`
          import { O } from "byenull";

          if (O.isSome(option)) {}
        `,
      errors: [
        {
          message: "Use `O.isSome(option)` instead of `!O.isNone(option)`.",
          line: 3,
          column: 4,
        },
      ],
    },
  ],
});
