import { defineConfig } from "drizzle-kit";

const configDir = process.env.XDG_CONFIG_HOME ?? `${process.env.HOME}/.config`;

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/database/schema.ts",
  dbCredentials: {
    url: `${configDir}/motherbase/motherbase.db`,
  },
});
