import type { ToolDefinition } from "../definition";
import { prompt } from "./prompt";
import { inputSchema } from "./schema";

export const createReadTool = (): ToolDefinition => ({
  name: "read",
  description: prompt,
  inputSchema,
  execute: async () => null,
});
