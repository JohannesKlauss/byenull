import dedent from "dedent";

import { ruleTester } from "../tester";
import { consistentNamespace } from "./consistent-namespace";

ruleTester.run("consistent-namespace", consistentNamespace, {
  valid: [
    // Default option ("Option")
    {
      code: dedent`
          import { Option } from "byenull";

          const option = Option.some("u123");
        `,
    },

    // Explicit "O" option
    {
      code: dedent`
          import { O } from "byenull";

          const option = O.some("u123");
        `,
      options: ["O"],
    },

    // Non-byenull imports should not trigger
    {
      code: dedent`
          import { O } from "other-package";

          const option = O.some("u123");
        `,
    },
    {
      code: dedent`
          import { O } from "other-package";

          const option = O.some("u123");
        `,
      options: ["Option"],
    },

    // Other named imports from byenull should not trigger
    {
      code: dedent`
          import { some } from "byenull";

          const option = some("u123");
        `,
    },
  ],
  invalid: [
    // Default ("Option"): using O
    {
      code: dedent`
          import { O } from "byenull";

          const option = O.some("u123");
        `,
      output: dedent`
          import { Option } from "byenull";

          const option = Option.some("u123");
        `,
      errors: [
        {
          message: "Use `Option` instead of `O` as the byenull namespace.",
          line: 1,
          column: 9,
        },
      ],
    },

    // Explicit "O": using Option
    {
      code: dedent`
          import { Option } from "byenull";

          const option = Option.some("u123");
        `,
      options: ["O"],
      output: dedent`
          import { O } from "byenull";

          const option = O.some("u123");
        `,
      errors: [
        {
          message: "Use `O` instead of `Option` as the byenull namespace.",
          line: 1,
          column: 9,
        },
      ],
    },

    // Both imported: remove trailing specifier
    {
      code: dedent`
          import { Option, O } from "byenull";

          const option1 = Option.some("u123");
          const option2 = O.some("u456");
        `,
      output: dedent`
          import { Option } from "byenull";

          const option1 = Option.some("u123");
          const option2 = Option.some("u456");
        `,
      errors: [
        {
          message: "Use `Option` instead of `O` as the byenull namespace.",
          line: 1,
          column: 17,
        },
      ],
    },

    // Both imported: remove leading specifier
    {
      code: dedent`
          import { O, Option } from "byenull";

          const option1 = O.some("u123");
          const option2 = Option.some("u456");
        `,
      output: dedent`
          import { Option } from "byenull";

          const option1 = Option.some("u123");
          const option2 = Option.some("u456");
        `,
      errors: [
        {
          message: "Use `Option` instead of `O` as the byenull namespace.",
          line: 1,
          column: 9,
        },
      ],
    },

    // Both imported with explicit "O": remove leading specifier
    {
      code: dedent`
          import { Option, O } from "byenull";

          const option1 = Option.some("u123");
          const option2 = O.some("u456");
        `,
      options: ["O"],
      output: dedent`
          import { O } from "byenull";

          const option1 = O.some("u123");
          const option2 = O.some("u456");
        `,
      errors: [
        {
          message: "Use `O` instead of `Option` as the byenull namespace.",
          line: 1,
          column: 9,
        },
      ],
    },
  ],
});
