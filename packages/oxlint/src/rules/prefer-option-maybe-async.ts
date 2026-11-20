import { defineRule } from "@oxlint/plugins";

import { getByenullSettings } from "../helpers/get-byenull-settings";
import { getImportSource } from "../helpers/get-import-source";
import { getTypeNamePrefix } from "../helpers/get-type-name-prefix";
import { hasTypeArguments } from "../helpers/has-type-arguments";
import { isByenullTypeName } from "../helpers/is-byenull-type-name";

export const preferOptionMaybeAsync = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer `OptionMaybeAsync<T>` over `Option<T> | OptionAsync<T>`",
      recommended: true,
    },
    messages: {
      preferOptionMaybeAsync: "Use `OptionMaybeAsync<T>` instead of `Option<T> | OptionAsync<T>`.",
    },
    fixable: "code",
  },
  createOnce: (context) => {
    return {
      TSUnionType: (node) => {
        const settings = getByenullSettings(context);

        const optionTypeNode = node.types.find((type) => {
          return (
            isByenullTypeName(type, settings.namespace, ["Option"]) && hasTypeArguments(type, 1)
          );
        });
        const optionAsyncTypeNode = node.types.find((type) => {
          return (
            isByenullTypeName(type, settings.namespace, ["OptionAsync"]) &&
            hasTypeArguments(type, 1)
          );
        });

        if (!optionTypeNode || !optionAsyncTypeNode) return;

        const importSources = [
          getImportSource(context.sourceCode.getScope(node), optionTypeNode.typeName.left),
          getImportSource(context.sourceCode.getScope(node), optionAsyncTypeNode.typeName.left),
        ];
        if (importSources.some((source) => !source || !settings.module.includes(source))) {
          return;
        }

        const typeNamePrefix = getTypeNamePrefix(optionTypeNode.typeName);

        const optionT = context.sourceCode.getText(optionTypeNode.typeArguments.params[0]);
        const optionAsyncT = context.sourceCode.getText(
          optionAsyncTypeNode.typeArguments.params[0],
        );

        if (optionT !== optionAsyncT) return;

        context.report({
          node,
          messageId: "preferOptionMaybeAsync",
          fix: (fixer) => {
            const types = node.types
              .map((type) => {
                if (type === optionTypeNode) return `${typeNamePrefix}OptionMaybeAsync<${optionT}>`;
                if (type === optionAsyncTypeNode) return null;
                return context.sourceCode.getText(type);
              })
              .filter((type): type is string => type !== null);

            return fixer.replaceText(node, types.join(" | "));
          },
        });
      },
    };
  },
});
