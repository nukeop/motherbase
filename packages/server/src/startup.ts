import { registerBuiltinTools } from "./agent/tools/builtin";
import { initLogger } from "./logger";

export const startup = async (): Promise<void> => {
  await initLogger();
  registerBuiltinTools();
};
