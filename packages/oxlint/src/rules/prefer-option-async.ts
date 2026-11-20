import { defineRule } from "@oxlint/plugins";

import { getByenullSettings } from "../helpers/get-byenull-settings";
import { getImportSource } from "../helpers/get-import-source";
import { getTypeNamePrefix } from "../helpers/get-type-name-prefix";
import { hasTypeArguments } from "../helpers/has-type-arguments";
import { isByenullTypeName } from "../helpers/is-byenull-type-name";
import { isIdentifierTypeName } from "../helpers/is-identifier-type-name";

export const preferOptionAsync = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer `OptionAsync<T>` over `Promise<Option<T>>`",
      recommended: true,
    },
    messages: {
      preferOptionAsync: "Use `OptionAsync<T>` instead of `Promise<Option<T>>`.",
    },
    fixable: "code",
  },
  createOnce: (context) => {
    return {
      TSTypeReference: (node) => {
        const settings = getByenullSettings(context);

        if (!isIdentifierTypeName(node, "Promise")) return;
        if (!hasTypeArguments(node, 1)) return;

        const innerType = node.typeArguments.params[0];
        if (!isByenullTypeName(innerType, settings.namespace, ["Option"])) return;
        if (!hasTypeArguments(innerType, 1)) return;

        const importSource = getImportSource(
          context.sourceCode.getScope(node),
          innerType.typeName.left,
        );
        if (!importSource || !settings.module.includes(importSource)) return;

        context.report({
          node,
          messageId: "preferOptionAsync",
          fix: (fixer) => {
            const typeNamePrefix = getTypeNamePrefix(innerType.typeName);
            const typeParameter = context.sourceCode.getText(innerType.typeArguments.params[0]);

            return fixer.replaceText(node, `${typeNamePrefix}OptionAsync<${typeParameter}>`);
          },
        });
      },
    };
  },
});
