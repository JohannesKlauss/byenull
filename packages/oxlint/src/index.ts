import { eslintCompatPlugin } from "@oxlint/plugins";
import { defineConfig } from "oxlint";

import { consistentNamespace } from "./rules/consistent-namespace";

import type { Plugin } from "@oxlint/plugins";
import type { OxlintConfig } from "oxlint";

type OxlintPlugin = Plugin & { recommended: OxlintConfig };

const oxlintByenullPlugin = eslintCompatPlugin({
  meta: {
    name: "byenull",
  },
  rules: {
    "consistent-namespace": consistentNamespace,
  },
}) as OxlintPlugin;

oxlintByenullPlugin.recommended = defineConfig({
  jsPlugins: [
    {
      name: "byenull",
      specifier: "byenull-oxlint",
    },
  ],
  rules: {
    "byenull/consistent-namespace": "error",
  },
});

export default oxlintByenullPlugin;
