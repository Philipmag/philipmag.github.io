import { defineConfig } from "vitest/config";
import path from "node:path";
const root = import.meta.dirname;
export default defineConfig({
  root,
  resolve: { alias: { "@": path.resolve(root, "src"), "@shared": path.resolve(root, "shared") } },
  test: { environment: "node", include: ["server/**/*.test.ts", "server/**/*.spec.ts"] },
});
