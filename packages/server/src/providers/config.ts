import { z } from "zod";

import { configPath } from "../paths";

export const configSchema = z.object({
  provider: z.string(),
  model: z.string(),
  cheap: z.object({
    provider: z.string(),
    model: z.string(),
  }),
  generateTitles: z.boolean(),
});

export type Config = z.infer<typeof configSchema>;

const defaultConfig: Config = {
  provider: "",
  model: "",
  cheap: { provider: "", model: "" },
  generateTitles: false,
};

export const readConfig = async (): Promise<Config> => {
  const file = Bun.file(configPath);
  if (!(await file.exists())) {
    await Bun.write(file, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return configSchema.parse(await file.json());
};
