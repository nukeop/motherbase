import { jsonValueSchema } from "@motherbase/core";
import { z } from "zod";
import {
  type ToolDefinition,
  ToolError,
} from "../../src/agent/tools/definition";
import type { TestTool } from "../../src/api/test-schemas";

const toExecute = (tool: TestTool): ToolDefinition["execute"] => {
  switch (tool.behavior) {
    case "success":
      return async () => tool.output ?? null;
    case "tool-error":
      return async () => {
        throw new ToolError(tool.message ?? "scripted tool error");
      };
    case "crash":
      return async () => {
        throw new Error(tool.message ?? "scripted crash");
      };
  }
};

export const toToolDefinition = (tool: TestTool): ToolDefinition => ({
  name: tool.name,
  description: tool.description,
  inputSchema: z.record(z.string(), jsonValueSchema),
  execute: toExecute(tool),
});
