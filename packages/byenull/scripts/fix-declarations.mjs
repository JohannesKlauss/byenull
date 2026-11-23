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
const imported = new Map();
for (const match of declarations.matchAll(/^import \{ ([^}]+) \} from "([^"]+)";$/gm)) {
  for (const binding of match[1].split(",")) {
    const parts = binding.trim().split(/\s+as\s+/);
    const local = parts[1] ?? parts[0];
    imported.set(local, { original: parts[0], module: match[2] });
  }
}
const unresolved = missing.filter((name) => !imported.has(name));

if (unresolved.length > 0) {
  throw new Error(
    `No declaration or import found for: ${unresolved.join(", ")}. ` +
      "The dts generator output shape has changed - this script needs an update.",
  );
}
if (aliases.length !== 2 || !aliases.includes("Option") || !aliases.includes("O")) {
  throw new Error("Expected exactly the Option and O namespace aliases.");
}

if (declarations.includes(SHIM)) {
  throw new Error(`Unexpected '${SHIM}' occurrence inside the declarations.`);
}

// `dist/exports.d.mts`: all declarations, exported at declaration site.
const reexports = missing.map((name) => {
  const { original, module } = imported.get(name);
  if (!module.startsWith("./")) {
    throw new Error(`Expected a local shared declaration chunk for ${name}.`);
  }
  const chunk = readFileSync(new URL(module.replace(/\.mjs$/, ".d.mts"), indexFile), "utf8");
  if (!new RegExp(`\\bas ${original}\\b`).test(chunk)) {
    throw new Error(`Shared declaration chunk does not export ${original} for ${name}.`);
  }
  return `export type { ${original} as ${name} } from "${module}";`;
});
writeFileSync(exportsFile, lines.join("\n") + reexports.join("\n") + `\n//#endregion\n`);

// `dist/index.d.mts`: byethrow-style namespace re-exports.
writeFileSync(
  indexFile,
  aliases.map((alias) => `export * as ${alias} from "./exports.mjs";`).join("\n") + "\n",
);

console.log(
  `Declarations rewritten: dist/exports.d.mts (${names.length} exports), ` +
    `dist/index.d.mts (${aliases.map((alias) => `export * as ${alias}`).join(", ")}).`,
);
