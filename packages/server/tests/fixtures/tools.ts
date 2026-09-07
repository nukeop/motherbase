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

const pathInputSchema = z.object({ path: z.string() });

export const claimedReadTool: ToolDefinition = {
  name: "read",
  description: "Reads a path requesting permission for that path",
  inputSchema: pathInputSchema,
  claim: (input) => ({ verb: "read", path: pathInputSchema.parse(input).path }),
  execute: async (input) => ({ read: pathInputSchema.parse(input).path }),
};

export const claimedWriteTool: ToolDefinition = {
  name: "write",
  description: "Writes a path requesting permission for that path",
  inputSchema: pathInputSchema,
  claim: (input) => ({
    verb: "write",
    path: pathInputSchema.parse(input).path,
  }),
  execute: async (input) => ({ wrote: pathInputSchema.parse(input).path }),
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
