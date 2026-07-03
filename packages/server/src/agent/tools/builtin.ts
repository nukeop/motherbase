import * as nodeFs from "node:fs/promises";
import { createReadTool } from "./read";
import { registerTool } from "./registry";

export const registerBuiltinTools = (): void => {
  registerTool(createReadTool({ fs: nodeFs }));
};
