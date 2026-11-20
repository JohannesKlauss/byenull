import { readFileSync, writeFileSync } from "node:fs";

const SHIM = "exports_d_exports";
const indexFile = new URL("../dist/index.d.mts", import.meta.url);
const exportsFile = new URL("../dist/exports.d.mts", import.meta.url);

const source = readFileSync(indexFile, "utf8");

const namespaceBlock = source.match(
  new RegExp(`declare namespace ${SHIM} \\{\\n  export \\{ ([^}]+) \\};\\n\\}\\n`),
);
const finalExport = source.match(
  new RegExp(`^export \\{ ${SHIM} as \\w+(?:, ${SHIM} as \\w+)* \\};$`, "m"),
);

if (!namespaceBlock || !finalExport) {
  throw new Error(
    `Could not find the '${SHIM}' namespace shim in dist/index.d.mts. ` +
      "The dts generator output shape has changed - " +
      "this script may no longer be needed (or needs an update).",
  );
}

const names = namespaceBlock[1].split(",").map((name) => name.trim());
const aliases = [...finalExport[0].matchAll(new RegExp(`${SHIM} as (\\w+)`, "g"))].map(
  (match) => match[1],
);

if (names.length === 0 || names.some((name) => name === "")) {
  throw new Error("Empty export list in the generated namespace shim.");
}
if (aliases.length === 0) {
  throw new Error("No namespace aliases found in the generated exports.");
}

const declarations = source.slice(0, namespaceBlock.index);
const lines = declarations.split("\n");
const declared = new Map();

for (let i = 0; i < lines.length; i++) {
  const match = lines[i]?.match(
    /^((?:declare )?(?:function|type|const|class|interface|enum) (\w+)\b)/,
  );
  if (match && names.includes(match[2])) {
    lines[i] = `export ${lines[i]}`;
    declared.set(match[2], (declared.get(match[2]) ?? 0) + 1);
  }
}

const missing = names.filter((name) => !declared.has(name));

if (missing.length > 0) {
  throw new Error(
    `No declaration found for: ${missing.join(", ")}. ` +
      "The dts generator output shape has changed - this script needs an update.",
  );
}

if (declarations.includes(SHIM)) {
  throw new Error(`Unexpected '${SHIM}' occurrence inside the declarations.`);
}

// `dist/exports.d.mts`: all declarations, exported at declaration site.
writeFileSync(exportsFile, lines.join("\n") + `//#endregion\n`);

// `dist/index.d.mts`: byethrow-style namespace re-exports.
writeFileSync(
  indexFile,
  aliases.map((alias) => `export * as ${alias} from "./exports.mjs";`).join("\n") + "\n",
);

console.log(
  `Declarations rewritten: dist/exports.d.mts (${names.length} exports), ` +
    `dist/index.d.mts (${aliases.map((alias) => `export * as ${alias}`).join(", ")}).`,
);
