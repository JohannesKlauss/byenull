import { eslintCompatPlugin } from "@oxlint/plugins";
import { defineConfig } from "oxlint";

import { consistentNamespace } from "./rules/consistent-namespace";
import { noAmbiguousSomeType } from "./rules/no-ambiguous-some-type";
import { noNegatedTypeGuards } from "./rules/no-negated-type-guards";
import { preferOptionAsync } from "./rules/prefer-option-async";
import { preferOptionMatchers } from "./rules/prefer-option-matchers";
import { preferOptionMaybeAsync } from "./rules/prefer-option-maybe-async";

import type { Plugin } from "@oxlint/plugins";
import type { OxlintConfig } from "oxlint";

type OxlintPlugin = Plugin & { recommended: OxlintConfig };

const jsPlugins = [
  {
    name: "byenull",
    specifier: "byenull-oxlint",
  },
];

const oxlintByenullPlugin = eslintCompatPlugin({
  meta: {
    name: "byenull",
  },
  rules: {
    "consistent-namespace": consistentNamespace,
    "no-ambiguous-some-type": noAmbiguousSomeType,
    "no-negated-type-guards": noNegatedTypeGuards,
    "prefer-option-async": preferOptionAsync,
    "prefer-option-matchers": preferOptionMatchers,
    "prefer-option-maybe-async": preferOptionMaybeAsync,
  },
}) as OxlintPlugin;

const byenullRules = (testing: boolean): Record<string, "error"> =>
  Object.fromEntries(
    Object.entries(oxlintByenullPlugin.rules)
      .filter(([, rule]) => (rule.meta?.docs?.["testing"] === true) === testing)
      .map(([key]) => [`byenull/${key}`, "error" as const] as const),
  );

oxlintByenullPlugin.recommended = defineConfig({
  jsPlugins,
  rules: byenullRules(false),
  overrides: [
    {
      files: ["**/*.test.*", "**/*.test-d.*", "**/__tests__/**/*"],
      jsPlugins,
      rules: byenullRules(true),
    },
  ],
});

export default oxlintByenullPlugin;
