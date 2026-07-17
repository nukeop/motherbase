import { getLogger } from "@logtape/logtape";
import { z } from "zod";

import { configPath } from "../paths";

const logger = getLogger(["Motherbase", "Providers", "Config"]);

export const configSchema = z.object({
  provider: z.string().min(1, "must not be empty"),
  model: z.string().min(1, "must not be empty"),
  cheap: z.object({
    provider: z.string().min(1, "must not be empty"),
    model: z.string().min(1, "must not be empty"),
  }),
  generateTitles: z.boolean().default(false),
});

export type Config = z.infer<typeof configSchema>;

export const readConfig = async (): Promise<Config> => {
  const file = Bun.file(configPath);
  return configSchema.parse(await file.json());
};

const quit = (reason: string): never => {
  logger.fatal(`Invalid config at ${configPath}\n${reason}`);
  process.exit(1);
};

const storedConfig = async (file: ReturnType<typeof Bun.file>) => {
  if (!(await file.exists())) {
    return {};
  }
  return file.json().catch((error: Error) => quit(error.message));
};

export const initConfig = async (): Promise<void> => {
  const file = Bun.file(configPath);
  const parsed = configSchema.safeParse(await storedConfig(file));
  if (!parsed.success) {
    quit(z.prettifyError(parsed.error));
  } else {
    await Bun.write(file, JSON.stringify(parsed.data, null, 2));
  }
};
