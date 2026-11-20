import { defineRule } from "@oxlint/plugins";

import { getByenullSettings } from "../helpers/get-byenull-settings";
import { getImportSource } from "../helpers/get-import-source";
import { getRootCallExpression } from "../helpers/get-root-call-expression";
import { hasIdentifier } from "../helpers/has-identifier";
import { isCallExpression } from "../helpers/is-call-expression";
import { isModuleCallExpression } from "../helpers/is-module-call-expression";

const CHECKER_TO_MATCHER = {
  isSome: "toBeSome",
  isNone: "toBeNone",
} as const;

const CHECKER_TO_CALLBACK = {
  isSome: "(value) => {}",
  isNone: "",
} as const;

const UNWRAP_TO_MATCHER = {
  unwrap: "toBeSome",
} as const;

const UNWRAP_TO_CALLBACK = {
  unwrap: "(value) => {}",
} as const;

export const preferOptionMatchers = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer `expect(option).toBeSome()` over `expect(Option.isSome(option)).toBe(true)`, `assert(Option.isSome(option))`, or `Option.unwrap(option)`",
      recommended: true,
      testing: true,
    },
    messages: {
      preferOptionMatchersOverExpect:
        "Use `expect(option).{{ matcher }}()` instead of `{{ target }}`.",
      preferOptionMatchersOverAssert:
        "Use `expect(option).{{ matcher }}()` instead of `{{ target }}`.",
      preferOptionMatchersOverUnwrap:
        "Use `expect(option).{{ matcher }}({{ callback }})` instead of `{{ target }}`.",
    },
    fixable: "code",
  },
  createOnce: (context) => {
    return {
      CallExpression: (node) => {
        const settings = getByenullSettings(context);

        // expect(Option.isSome(option)) / expect(Option.isNone(option))
        if (
          node.callee.type === "MemberExpression" &&
          isCallExpression(node, ["toBe", "toBeTruthy", "toBeFalsy"])
        ) {
          const callExpression = getRootCallExpression(node);
          if (!callExpression || !isCallExpression(callExpression, ["expect"])) {
            return;
          }

          const expectArg = callExpression.arguments[0];
          if (
            !expectArg ||
            !isModuleCallExpression(expectArg, settings.namespace, ["isSome", "isNone"])
          ) {
            return;
          }

          const importSource = getImportSource(
            context.sourceCode.getScope(node),
            expectArg.callee.object,
          );
          if (!importSource || !settings.module.includes(importSource)) return;

          const isTruthyAssertion =
            node.callee.property.name === "toBeTruthy" ||
            (!!node.arguments[0] &&
              node.arguments[0].type === "Literal" &&
              !!node.arguments[0].value);

          const shouldFlip = hasIdentifier(node.callee.object, "not") === isTruthyAssertion;
          const checker = shouldFlip
            ? expectArg.callee.property.name === "isSome"
              ? "isNone"
              : "isSome"
            : expectArg.callee.property.name;
          const matcher = CHECKER_TO_MATCHER[checker];

          context.report({
            node,
            messageId: "preferOptionMatchersOverExpect",
            data: { matcher, target: context.sourceCode.getText(node) },
            fix: (fixer) => {
              const option = context.sourceCode.getText(expectArg.arguments[0]);
              return fixer.replaceText(node, `expect(${option}).${matcher}()`);
            },
          });
          return;
        }

        // assert(Option.isSome(option)) / assert(Option.isNone(option))
        if (isCallExpression(node, ["assert"])) {
          const arg = node.arguments[0];
          if (!arg || !isModuleCallExpression(arg, settings.namespace, ["isSome", "isNone"])) {
            return;
          }

          const importSource = getImportSource(
            context.sourceCode.getScope(node),
            arg.callee.object,
          );
          if (!importSource || !settings.module.includes(importSource)) return;

          const matcher = CHECKER_TO_MATCHER[arg.callee.property.name];
          const callback = CHECKER_TO_CALLBACK[arg.callee.property.name];
          context.report({
            node,
            messageId: "preferOptionMatchersOverAssert",
            data: { matcher, target: context.sourceCode.getText(node) },
            fix: (fixer) => {
              const option = context.sourceCode.getText(arg.arguments[0]);
              return fixer.replaceText(node, `expect(${option}).${matcher}(${callback})`);
            },
          });
          return;
        }

        // Option.unwrap(option)
        if (isModuleCallExpression(node, settings.namespace, ["unwrap"])) {
          const importSource = getImportSource(
            context.sourceCode.getScope(node),
            node.callee.object,
          );
          if (!importSource || !settings.module.includes(importSource)) return;

          const matcher = UNWRAP_TO_MATCHER[node.callee.property.name];
          const callback = UNWRAP_TO_CALLBACK[node.callee.property.name];
          context.report({
            node,
            messageId: "preferOptionMatchersOverUnwrap",
            data: { matcher, callback, target: context.sourceCode.getText(node) },
            fix: (fixer) => {
              const option = context.sourceCode.getText(node.arguments[0]);
              return fixer.replaceText(node, `expect(${option}).${matcher}(${callback})`);
            },
          });
          return;
        }
      },
    };
  },
});
