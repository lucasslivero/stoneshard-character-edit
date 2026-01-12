import { resolve } from "node:path";

export const aliases = {
  "@shared": resolve("src/shared"),
  "@ui": resolve("src/renderer/ui"),
  "@shadcn": resolve("src/renderer/ui/components/ui"),
  "@app": resolve("src/renderer/app"),
};
