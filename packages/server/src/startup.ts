import { registerBuiltinTools } from "./agent/tools/builtin";
import { initLogger } from "./logger";
import { initConfig } from "./providers/config";

export const startup = async (): Promise<void> => {
  await initLogger();
  await initConfig();
  registerBuiltinTools();
};
