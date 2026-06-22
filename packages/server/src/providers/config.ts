import { z } from "zod";

const configSchema = z.object({
  provider: z.string(),
});

export type Config = z.infer<typeof configSchema>;

const configDir = process.env.XDG_CONFIG_HOME ?? `${process.env.HOME}/.config`;

export const configPath = `${configDir}/motherbase/config.json`;

const defaultConfig: Config = {
  provider: "",
};

export const readConfig = async (): Promise<Config> => {
  const file = Bun.file(configPath);
  if (!(await file.exists())) {
    await Bun.write(file, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return configSchema.parse(await file.json());
};
