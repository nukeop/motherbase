import { resolve } from "node:path";
import { defineConfig } from "@playwright/test";

const testConfigHome = resolve(
  import.meta.dirname,
  "tests/e2e/fixtures/config-home",
);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 15_000,
  workers: 1,
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
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
      env: { NODE_ENV: "test", XDG_CONFIG_HOME: testConfigHome },
    },
    {
      command: "bun --filter @motherbase/web dev",
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
