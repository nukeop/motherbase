import { jsonValueSchema } from "@motherbase/core";
import { z } from "zod";
import {
  type ToolDefinition,
  ToolError,
} from "../../src/agent/tools/definition";

export const echoTool: ToolDefinition = {
  name: "echo",
  description: "Echoes its input back",
  inputSchema: z.record(z.string(), jsonValueSchema),
  execute: async (input) => ({ echoed: jsonValueSchema.parse(input) }),
};

export const toolErrorTool: ToolDefinition = {
  name: "fail",
  description: "Throws a deliberate ToolError",
  inputSchema: z.record(z.string(), jsonValueSchema),
  execute: async () => {
    throw new ToolError("deliberately broken");
  },
};

export const crashingTool: ToolDefinition = {
  name: "fail",
  description: "Crashes with an unexpected error",
  inputSchema: z.record(z.string(), jsonValueSchema),
  execute: async () => {
    throw new Error("unexpected kaboom");
  },
};
