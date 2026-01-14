import { defineConfig } from "vite";
import { aliases } from "./vite.config";

export default defineConfig({
  build: {
    minify: true,
    lib: {
      formats: ["es"],
      entry: "src/main/main.ts",
      fileName: "main",
    },
  },
  resolve: {
    alias: aliases,
  },
});
