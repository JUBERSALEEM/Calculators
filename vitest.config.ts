import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["lib/**/*.test.ts", "calculators/**/*.test.ts", "components/**/*.test.ts"],
    exclude: ["node_modules", ".next", "out", "tests/e2e"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
