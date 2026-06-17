import { z } from "zod";

const configSchema = z.object({
  provider: z.string(),
});

export type Config = z.infer<typeof configSchema>;

const configDir = process.env.XDG_CONFIG_HOME ?? `${process.env.HOME}/.config`;

export const configPath = `${configDir}/motherbase/config.json`;

export const readConfig = async (): Promise<Config> => {
  const file = Bun.file(configPath);
  if (!(await file.exists())) {
    throw new Error(`Config file not found. Create it at ${configPath}`);
  }
  return configSchema.parse(await file.json());
};
