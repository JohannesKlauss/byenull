import { defineRule } from "@oxlint/plugins";

import { getByenullSettings } from "../helpers/get-byenull-settings";
import { getImportSource } from "../helpers/get-import-source";
import { hasTypeArguments } from "../helpers/has-type-arguments";
import { isByenullTypeName } from "../helpers/is-byenull-type-name";

import type { ESTree } from "@oxlint/plugins";

const AMBIGUOUS_SOME_TYPES = new Set<ESTree.TSType["type"]>([
  "TSUnknownKeyword",
  "TSAnyKeyword",
  "TSObjectKeyword",
]);

export const noAmbiguousSomeType = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow non-specific Some types (`unknown`, `any`, `object`, `{}`) in Option types",
      recommended: true,
    },
    messages: {
      noAmbiguousSomeType:
        "Specify a concrete Some type instead of `{{ type }}` in `{{ option }}`.",
    },
  },
  createOnce: (context) => {
    return {
      TSTypeReference: (node) => {
        const settings = getByenullSettings(context);

        if (
          !isByenullTypeName(node, settings.namespace, [
            "Option",
            "OptionAsync",
            "OptionMaybeAsync",
            "Some",
          ])
        ) {
          return;
        }
        if (!hasTypeArguments(node, 1)) return;

        const importSource = getImportSource(context.sourceCode.getScope(node), node.typeName.left);
        if (!importSource || !settings.module.includes(importSource)) return;

        const someNode = node.typeArguments.params[0];
        if (someNode.type === "TSTypeLiteral") {
          if (0 < someNode.members.length) return;
        } else if (!AMBIGUOUS_SOME_TYPES.has(someNode.type)) {
          return;
        }

        context.report({
          node: someNode,
          messageId: "noAmbiguousSomeType",
          data: {
            type: context.sourceCode.getText(someNode),
            option: context.sourceCode.getText(node),
          },
        });
      },
    };
  },
});
