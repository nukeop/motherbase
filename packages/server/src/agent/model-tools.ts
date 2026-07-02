import { type Tool, type ToolSet, tool } from "ai";
import type { ToolDefinition } from "./tools/definition";

export const toSdkTools = (
  tools: readonly ToolDefinition[],
): ToolSet | undefined => {
  if (tools.length === 0) {
    return undefined;
  }
  const entries = tools.map((definition): [string, Tool] => [
    definition.name,
    tool({
      description: definition.description,
      inputSchema: definition.inputSchema,
    }),
  ]);
  return Object.fromEntries(entries);
};
