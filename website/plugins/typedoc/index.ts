import fs from "node:fs";
import path from "node:path";

import { Application, Converter, DeclarationReflection, ReflectionKind } from "typedoc";
import { load as pluginFrontmatter } from "typedoc-plugin-frontmatter";
import { load as pluginMarkdown, MarkdownPageEvent } from "typedoc-plugin-markdown";

import type { RspressPlugin } from "@rspress/core";
import type { Reflection } from "typedoc";
import type { MarkdownTheme } from "typedoc-plugin-markdown";
import type ts from "typescript";

// Ported from @praha/byethrow (MIT) — https://github.com/praha-inc/byethrow
// Simplified for byenull: single locale, no flow-diagram embedding.

/**
 * Overloaded functions are documented on their first overload signature so that the comment is kept in the emitted `.d.ts`.
 * TypeDoc copies that comment to every call signature, so it is attached to the function itself instead,
 * which prevents TypeDoc from repeating it for each signature.
 */
const pluginOverloadComment = (app: Application) => {
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection) => {
    if (!reflection.kindOf(ReflectionKind.Function) || reflection.comment) return;

    const [declaration, ...overloads] =
      context.getSymbolFromReflection(reflection)?.declarations ?? [];
    if (!declaration || overloads.length <= 0) return;

    const comment = context.getSignatureComment(declaration as ts.SignatureDeclaration);
    if (comment) reflection.comment = comment;
  });
};

const pluginDescription = (app: Application) => {
  app.renderer.on(MarkdownPageEvent.BEGIN, (page) => {
    if (!(page.model instanceof DeclarationReflection)) return;

    const context = (app.renderer.theme as MarkdownTheme).getRenderContext(
      page as MarkdownPageEvent<Reflection>,
    );
    const comment = page.model.comment || page.model.signatures?.[0]?.comment;
    if (comment) {
      // @ts-expect-error Typedoc does not recognize frontmatter property
      page["frontmatter"] = {
        description: context.helpers
          .getDescriptionForComment(comment)
          ?.replaceAll(/\[([^\]]+)]\([^)]+\)/g, "$1"),
      };
    }
  });
};

const createApiDocument = async (apiDirectory: string): Promise<void> => {
  const app = await Application.bootstrapWithPlugins({
    name: "byenull",
    entryPoints: ["../packages/byenull/src/index.ts"],
    tsconfig: "../packages/byenull/tsconfig.json",
    disableSources: true,
    router: "kind",
    readme: "none",
    indexFormat: "table",
    githubPages: false,
    requiredToBeDocumented: ["Class", "Function", "Interface"],
    categoryOrder: [
      "Core Types",
      "Infer Types",
      "Creators",
      "Combinators",
      "Unwraps",
      "Type Guards",
      "Interop",
      "Utilities",
      "*",
    ],
    // @ts-expect-error Typedoc does not export a type for this options
    plugin: [pluginFrontmatter, pluginMarkdown, pluginDescription, pluginOverloadComment],
    entryFileName: "index",
    hidePageHeader: true,
    hideBreadcrumbs: true,
    pageTitleTemplates: {
      module: "{kind}: {name}", // e.g. "Module: MyModule"
    },
  });

  const project = await app.convert();
  if (project) {
    // The markdown theme prefers a signature-level comment over the
    // function-level one; when a signature comment lost the @example tags,
    // put the full comment back on the first signature.
    const preserveExamples = (reflection: Reflection) => {
      if (
        reflection instanceof DeclarationReflection &&
        reflection.kindOf(ReflectionKind.Function) &&
        reflection.comment?.getTag("@example") &&
        reflection.signatures?.[0]?.comment &&
        !reflection.signatures[0].comment!.getTag("@example")
      ) {
        reflection.signatures[0].comment = reflection.comment;
      }
      reflection.traverse((child) => {
        preserveExamples(child);
        return true;
      });
    };
    preserveExamples(project);
    await app.outputs.writeOutput({ name: "markdown", path: apiDirectory }, project);
  }
};

const createMetaJson = async (apiDirectory: string): Promise<void> => {
  const metaJsonPath = path.join(apiDirectory, "_meta.json");
  await fs.promises.writeFile(
    metaJsonPath,
    JSON.stringify(
      [
        "index",
        {
          type: "dir",
          name: "modules",
          label: "Modules",
        },
        {
          type: "dir",
          name: "types",
          label: "Types",
        },
        {
          type: "dir",
          name: "functions",
          label: "Functions",
        },
      ],
      null,
      2,
    ),
  );
};

export const pluginTypedoc = (): RspressPlugin => {
  return {
    name: "byenull-typedoc",
    config: async (config) => {
      const apiDirectory = path.join(config.root!, "api");
      await createApiDocument(apiDirectory);
      await createMetaJson(apiDirectory);
      return config;
    },
  };
};
