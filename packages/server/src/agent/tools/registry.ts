import type { ToolDefinition } from "./definition";

const tools = new Map<string, ToolDefinition>();

export const registerTool = (tool: ToolDefinition): void => {
  tools.set(tool.name, tool);
};

export const getTools = (): ToolDefinition[] => [...tools.values()];

export const findTool = (name: string): ToolDefinition | undefined =>
  tools.get(name);
