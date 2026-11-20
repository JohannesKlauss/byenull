import dedent from "dedent";

import { ruleTester } from "../tester";
import { noAmbiguousSomeType } from "./no-ambiguous-some-type";

ruleTester.run("no-ambiguous-some-type", noAmbiguousSomeType, {
  valid: [
    // Concrete Some types are allowed
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<string>;
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = O.Option<string>;
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<{ id: string }>;
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionAsync<string>;
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = O.OptionAsync<string>;
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionMaybeAsync<string>;
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = O.OptionMaybeAsync<string>;
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Some<string>;
        `,
    },

    // Non-byenull Option types should not trigger
    {
      code: dedent`
          import { Option } from "other-package";

          type Test = Option.Option<unknown>;
        `,
    },
    {
      code: dedent`
          type Test = Option.Option<unknown>;
        `,
    },
  ],
  invalid: [
    // Option<T>
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<unknown>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `Option.Option<unknown>`.",
          line: 3,
          column: 26,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = O.Option<unknown>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `O.Option<unknown>`.",
          line: 3,
          column: 21,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<any>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `any` in `Option.Option<any>`.",
          line: 3,
          column: 26,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<object>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `object` in `Option.Option<object>`.",
          line: 3,
          column: 26,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<{}>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `{}` in `Option.Option<{}>`.",
          line: 3,
          column: 26,
        },
      ],
    },

    // OptionAsync<T>
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionAsync<unknown>;
        `,
      errors: [
        {
          message:
            "Specify a concrete Some type instead of `unknown` in `Option.OptionAsync<unknown>`.",
          line: 3,
          column: 31,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = O.OptionAsync<unknown>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `O.OptionAsync<unknown>`.",
          line: 3,
          column: 26,
        },
      ],
    },

    // OptionMaybeAsync<T>
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionMaybeAsync<unknown>;
        `,
      errors: [
        {
          message:
            "Specify a concrete Some type instead of `unknown` in `Option.OptionMaybeAsync<unknown>`.",
          line: 3,
          column: 36,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = O.OptionMaybeAsync<unknown>;
        `,
      errors: [
        {
          message:
            "Specify a concrete Some type instead of `unknown` in `O.OptionMaybeAsync<unknown>`.",
          line: 3,
          column: 31,
        },
      ],
    },

    // Some<T>
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Some<unknown>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `Option.Some<unknown>`.",
          line: 3,
          column: 24,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Some<{}>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `{}` in `Option.Some<{}>`.",
          line: 3,
          column: 24,
        },
      ],
    },

    // variable declaration
    {
      code: dedent`
          import { O } from "byenull";

          let test: O.Option<unknown>;
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `O.Option<unknown>`.",
          line: 3,
          column: 19,
        },
      ],
    },

    // function parameter
    {
      code: dedent`
          import { O } from "byenull";

          function test(arg: O.Option<unknown>) {}
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `O.Option<unknown>`.",
          line: 3,
          column: 28,
        },
      ],
    },

    // function return type
    {
      code: dedent`
          import { O } from "byenull";

          function test(): O.Option<unknown> {}
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `O.Option<unknown>`.",
          line: 3,
          column: 26,
        },
      ],
    },

    // arrow function return type
    {
      code: dedent`
          import { O } from "byenull";

          const test = (): O.Option<unknown> => {};
        `,
      errors: [
        {
          message: "Specify a concrete Some type instead of `unknown` in `O.Option<unknown>`.",
          line: 3,
          column: 26,
        },
      ],
    },
  ],
});
