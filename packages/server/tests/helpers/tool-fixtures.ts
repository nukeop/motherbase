import { jsonValueSchema, type ToolCallPart } from "@motherbase/core";
import { z } from "zod";
import type { ModelChunk } from "../../src/agent/model-chunk";
import {
  type ToolDefinition,
  ToolError,
} from "../../src/agent/tools/definition";
import type { Scenario } from "./scenario";

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

export const scriptToolCallTurn = (
  scenario: Scenario,
  calls: Omit<ToolCallPart, "type">[],
  prefixText?: string,
): void => {
  const chunks: ModelChunk[] = [];
  if (prefixText) {
    chunks.push({ type: "text-start" });
    chunks.push({ type: "text-delta", text: prefixText });
  }
  for (const call of calls) {
    chunks.push({ type: "tool-call", ...call });
  }
  chunks.push({ type: "finish", reason: "tool-calls" });
  scenario.scriptTurn(chunks);
};

export const scriptTextReply = (scenario: Scenario, text: string): void => {
  scenario.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text },
    { type: "finish", reason: "stop" },
  ]);
};
