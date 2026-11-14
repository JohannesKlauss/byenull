import * as path from "node:path";

import { defineConfig } from "@rspress/core";
import { pluginTwoslash } from "@rspress/plugin-twoslash";

import { pluginTypedoc } from "./plugins/typedoc";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "byenull",
  description:
    "A lightweight, tree-shakable Option type library for type-safe nullable handling in TypeScript.",
  logoText: "byenull",
  llms: true,
  plugins: [pluginTwoslash({ explicitTrigger: false }), pluginTypedoc()],
  markdown: {
    shiki: {
      langs: ["tsx", "ts", "js", "json", "bash"],
    },
  },
  lang: "en",
  route: {
    cleanUrls: true,
  },
  themeConfig: {
    lastUpdated: true,
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/JohannesKlauss/byenull",
      },
    ],
    editLink: {
      docRepoBaseUrl: "https://github.com/JohannesKlauss/byenull/tree/main/website/docs",
    },
    footer: {
      message: `© ${new Date().getFullYear()} Johannes Klauss`,
    },
  },
});
