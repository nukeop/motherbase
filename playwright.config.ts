import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 15_000,
  use: {
    baseURL: "http://localhost:5173",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: [
    {
      command: "bun run packages/server/src/index.ts",
      port: 4800,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "bun --filter @motherbase/web dev",
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
