import dedent from "dedent";

import { ruleTester } from "../tester";
import { preferOptionMaybeAsync } from "./prefer-option-maybe-async";

ruleTester.run("prefer-option-maybe-async", preferOptionMaybeAsync, {
  valid: [
    // These cases are valid because they already use OptionMaybeAsync from byenull.
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

          let test: Option.OptionMaybeAsync<string>;
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          function test(arg: O.OptionMaybeAsync<string>) {}
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          function test(): Option.OptionMaybeAsync<string> {}
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          const test = (arg: O.OptionMaybeAsync<string>) => {};
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          const test = (): Option.OptionMaybeAsync<string> => {};
        `,
    },

    // These cases are valid because the types are not from the byenull namespace.
    {
      code: dedent`
          type Test = Option<string> | OptionAsync<string>;
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          type Test = Option.Option<string> | Option.OptionAsync<string>;
        `,
    },

    // These cases are valid because the type parameters differ.
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<string> | Option.OptionAsync<number>;
        `,
    },

    // These cases are valid because the union does not contain both Option and OptionAsync.
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<string> | string;
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionAsync<string> | string;
        `,
    },
  ],
  invalid: [
    // type alias
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.Option<string> | Option.OptionAsync<string>;
        `,
      output: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionMaybeAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 12,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = O.Option<string> | O.OptionAsync<string>;
        `,
      output: dedent`
          import { O } from "byenull";

          type Test = O.OptionMaybeAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 12,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionAsync<string> | Option.Option<string>;
        `,
      output: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionMaybeAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 12,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = string | Option.Option<string> | Option.OptionAsync<string>;
        `,
      output: dedent`
          import { Option } from "byenull";

          type Test = string | Option.OptionMaybeAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 12,
        },
      ],
    },

    // variable declaration
    {
      code: dedent`
          import { Option } from "byenull";

          let test: Option.Option<string> | Option.OptionAsync<string>;
        `,
      output: dedent`
          import { Option } from "byenull";

          let test: Option.OptionMaybeAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 10,
        },
      ],
    },

    // function parameter
    {
      code: dedent`
          import { Option } from "byenull";

          function test(arg: Option.Option<string> | Option.OptionAsync<string>) {}
        `,
      output: dedent`
          import { Option } from "byenull";

          function test(arg: Option.OptionMaybeAsync<string>) {}
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 19,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          const test = (arg: O.Option<string> | O.OptionAsync<string>) => {};
        `,
      output: dedent`
          import { O } from "byenull";

          const test = (arg: O.OptionMaybeAsync<string>) => {};
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 19,
        },
      ],
    },

    // function return type
    {
      code: dedent`
          import { Option } from "byenull";

          function test(): Option.Option<string> | Option.OptionAsync<string> {}
        `,
      output: dedent`
          import { Option } from "byenull";

          function test(): Option.OptionMaybeAsync<string> {}
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          const test = (): O.Option<string> | O.OptionAsync<string> => {};
        `,
      output: dedent`
          import { O } from "byenull";

          const test = (): O.OptionMaybeAsync<string> => {};
        `,
      errors: [
        {
          message: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
          line: 3,
          column: 17,
        },
      ],
    },
  ],
});
