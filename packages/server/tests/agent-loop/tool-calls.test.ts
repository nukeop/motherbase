import { describe, expect, test } from "bun:test";
import {
  jsonValueSchema,
  type MessageEntry,
  type MessagePart,
  type ToolResultEntry,
} from "@motherbase/core";
import { z } from "zod";
import type { ToolDefinition } from "../../src/agent/tools/definition";
import { Scenario } from "../helpers/scenario";

const echoTool: ToolDefinition = {
  name: "echo",
  description: "Echoes its input back",
  inputSchema: z.record(z.string(), jsonValueSchema),
  execute: async (input) => ({ echoed: jsonValueSchema.parse(input) }),
};

describe("tool call turn", () => {
  test("a tool-calling reply executes the tool and the model continues with the result", async () => {
    const scenario = new Scenario();
    scenario.withTools([echoTool]);

    scenario.scriptTurn([
      { type: "text-start" },
      { type: "text-delta", text: "Checking" },
      {
        type: "tool-call",
        toolCallId: "call-1",
        toolName: "echo",
        input: { city: "Warsaw" },
      },
      { type: "finish", reason: "tool-calls" },
    ]);
    scenario.scriptTurn([
      { type: "text-start" },
      { type: "text-delta", text: "All done" },
      { type: "finish", reason: "stop" },
    ]);

    await scenario.sendMessage("Echo Warsaw please");

    const toolCallPart: MessagePart = {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "echo",
      input: { city: "Warsaw" },
    };
    const firstReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Checking" }, toolCallPart],
    };
    const toolResult: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "echo",
      output: { echoed: { city: "Warsaw" } },
      outcome: "success",
    };
    const secondReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "All done" }],
    };

    expect(scenario.events).toEqual([
      { type: "message-in-progress", parts: [{ type: "text", text: "" }] },
      {
        type: "message-in-progress",
        parts: [{ type: "text", text: "Checking" }],
      },
      {
        type: "message-in-progress",
        parts: [{ type: "text", text: "Checking" }, toolCallPart],
      },
      { type: "message-completed", message: firstReply },
      { type: "tool-result", result: toolResult },
      { type: "message-in-progress", parts: [{ type: "text", text: "" }] },
      {
        type: "message-in-progress",
        parts: [{ type: "text", text: "All done" }],
      },
      { type: "message-completed", message: secondReply },
      { type: "turn-completed" },
    ]);

    expect(scenario.runner.state).toEqual({ type: "idle" });

    expect(scenario.messages).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Echo Warsaw please" }],
      },
      firstReply,
      toolResult,
      secondReply,
    ]);
  });
});
