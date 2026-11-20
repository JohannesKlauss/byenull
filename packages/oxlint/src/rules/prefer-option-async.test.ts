import dedent from "dedent";

import { ruleTester } from "../tester";
import { preferOptionAsync } from "./prefer-option-async";

ruleTester.run("prefer-option-async", preferOptionAsync, {
  valid: [
    // These cases are valid because they already use the OptionAsync type from byenull.
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

          let Test: Option.OptionAsync<string>;
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          function Test(test: O.OptionAsync<string>) {}
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          function Test(): Option.OptionAsync<string> {}
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          const Test = (test: O.OptionAsync<string>) => {};
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          const Test = (): Option.OptionAsync<string> => {};
        `,
    },

    // These cases are valid because they do not use the Promise type.
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Array<Option.Option<string>>;
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          let Test: Array<O.Option<string>>;
        `,
    },
    {
      code: dedent`
          import { Option } from "byenull";

          function Test(test: Array<Option.Option<string>>) {}
        `,
    },
    {
      code: dedent`
          import { O } from "byenull";

          function Test(): Array<O.Option<string>> {}
        `,
    },
    {
      code: dedent`
          type Test = Promise<T>;
        `,
    },
    {
      code: dedent`
          let Test: Promise<T>;
        `,
    },
    {
      code: dedent`
          function Test(test: Promise<T>) {}
        `,
    },
    {
      code: dedent`
          function Test(): Promise<void> {}
        `,
    },
    {
      code: dedent`
          const Test = (test: Promise<T>) => {};
        `,
    },
    {
      code: dedent`
          const Test = (): Promise<void> => {};
        `,
    },

    // These cases are valid because they do not use the Option type from byenull.
    {
      code: dedent`
          type Test = Promise<Option<string>>;
        `,
    },
    {
      code: dedent`
          let Test: Promise<Option<string>>;
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          type Test = Promise<Option.Option<string>>;
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          let Test: Promise<Option.Option<string>>;
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          function Test(test: Promise<Option.Option<string>>) {}
        `,
    },
    {
      code: dedent`
          import { Option } from "other-package";

          function Test(): Promise<Option.Option<string>> {}
        `,
    },
  ],
  invalid: [
    // type alias
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Promise<Option.Option<string>>;
        `,
      output: dedent`
          import { Option } from "byenull";

          type Test = Option.OptionAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 12,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          type Test = Promise<O.Option<string>>;
        `,
      output: dedent`
          import { O } from "byenull";

          type Test = O.OptionAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 12,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          type Test = Array<Promise<Option.Option<string>>>;
        `,
      output: dedent`
          import { Option } from "byenull";

          type Test = Array<Option.OptionAsync<string>>;
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 18,
        },
      ],
    },

    // variable declaration
    {
      code: dedent`
          import { Option } from "byenull";

          let Test: Promise<Option.Option<string>>;
        `,
      output: dedent`
          import { Option } from "byenull";

          let Test: Option.OptionAsync<string>;
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 10,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          let Test: Array<Promise<O.Option<string>>>;
        `,
      output: dedent`
          import { O } from "byenull";

          let Test: Array<O.OptionAsync<string>>;
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 16,
        },
      ],
    },

    // function parameter
    {
      code: dedent`
          import { Option } from "byenull";

          function Test(test: Promise<Option.Option<string>>) {}
        `,
      output: dedent`
          import { Option } from "byenull";

          function Test(test: Option.OptionAsync<string>) {}
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 20,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          const Test = (test: Promise<O.Option<string>>) => {};
        `,
      output: dedent`
          import { O } from "byenull";

          const Test = (test: O.OptionAsync<string>) => {};
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 20,
        },
      ],
    },
    {
      code: dedent`
          import { Option } from "byenull";

          const Test = (test: Array<Promise<Option.Option<string>>>) => {};
        `,
      output: dedent`
          import { Option } from "byenull";

          const Test = (test: Array<Option.OptionAsync<string>>) => {};
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 26,
        },
      ],
    },

    // function return type
    {
      code: dedent`
          import { Option } from "byenull";

          function Test(): Promise<Option.Option<string>> {}
        `,
      output: dedent`
          import { Option } from "byenull";

          function Test(): Option.OptionAsync<string> {}
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: dedent`
          import { O } from "byenull";

          const Test = (): Promise<O.Option<string>> => {};
        `,
      output: dedent`
          import { O } from "byenull";

          const Test = (): O.OptionAsync<string> => {};
        `,
      errors: [
        {
          message: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
          line: 3,
          column: 17,
        },
      ],
    },
  ],
});
