import { defineConfig } from "vite";
import { aliases } from "./vite.config";

// https://vitejs.dev/config
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
