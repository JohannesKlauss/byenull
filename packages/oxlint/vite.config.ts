import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    format: ["esm", "cjs"],
    dts: {
      generator: "tsgo",
    },
    exports: false,
  },
});
