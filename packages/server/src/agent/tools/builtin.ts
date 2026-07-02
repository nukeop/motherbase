import type { ToolDefinition } from "./definition";
import { createReadTool } from "./read";
import { registerTool } from "./registry";

const builtinTools: ReadonlyArray<() => ToolDefinition> = [createReadTool];

export const registerBuiltinTools = (): void => {
  builtinTools.forEach(createTool => {
    registerTool(createTool());
  })
};
