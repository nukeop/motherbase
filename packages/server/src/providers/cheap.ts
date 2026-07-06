import type { LanguageModel } from "ai";
import { readConfig } from "./config";
import { getProvider } from "./index";

export const createCheapModel = async (): Promise<LanguageModel> => {
  const config = await readConfig();
  const provider = getProvider(config.cheap.provider);
  return provider.createModel(config.cheap.model);
};
