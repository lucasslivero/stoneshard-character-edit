import { defineConfig } from "vite";
import { aliases } from "./vite.config";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: aliases,
  },
});
