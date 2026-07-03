import { describe, expect, test } from "bun:test";
import type {
  JsonValue,
  MessageEntry,
  MessagePart,
  ToolResultEntry,
} from "@motherbase/core";
import { z } from "zod";
import type { ToolDefinition } from "../../src/agent/tools/definition";
import { crashingTool, echoTool, toolErrorTool } from "../fixtures/tools";
import { Scenario } from "../harness/scenario";
import { scriptTextReply, scriptToolCallTurn } from "../utils/scripting";

describe("tool call turn", () => {
  test("a tool-calling reply executes the tool and the model continues with the result", async () => {
    const scenario = new Scenario();
    scenario.withTools([echoTool]);

    scriptToolCallTurn(
      scenario,
      [{ toolCallId: "call-1", toolName: "echo", input: { city: "Warsaw" } }],
      "Checking",
    );
    scriptTextReply(scenario, "All done");

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

  test("a ToolError produces an error outcome and the turn continues", async () => {
    const scenario = new Scenario();
    scenario.withTools([toolErrorTool]);

    scriptToolCallTurn(scenario, [
      { toolCallId: "call-1", toolName: "fail", input: {} },
    ]);
    scriptTextReply(scenario, "Recovered");

    await scenario.sendMessage("break it");

    expect(scenario.messages[2]).toEqual({
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "fail",
      output: "deliberately broken",
      outcome: "error",
    });
    expect(scenario.messages[3]).toEqual({
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Recovered" }],
    });

    expect(scenario.events.some((e) => e.type === "error")).toBe(false);
  });

  test("an unexpected throw produces a crash outcome and the turn continues", async () => {
    const scenario = new Scenario();
    scenario.withTools([crashingTool]);

    scriptToolCallTurn(scenario, [
      { toolCallId: "call-1", toolName: "fail", input: {} },
    ]);
    scriptTextReply(scenario, "Recovered");

    await scenario.sendMessage("break it");

    expect(scenario.messages[2]).toEqual({
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "fail",
      output: "unexpected kaboom",
      outcome: "crash",
    });
    expect(scenario.messages[3]).toEqual({
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Recovered" }],
    });
  });

  test("calling an unknown tool produces an error outcome", async () => {
    const scenario = new Scenario();
    scenario.withTools([echoTool]);

    scriptToolCallTurn(scenario, [
      { toolCallId: "call-1", toolName: "nonexistent", input: {} },
    ]);
    scriptTextReply(scenario, "Sorry");

    await scenario.sendMessage("use a ghost tool");

    expect(scenario.messages[2]).toEqual({
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "nonexistent",
      output: "No such tool: nonexistent",
      outcome: "error",
    });
  });

  test("invalid input against the tool schema produces an error outcome", async () => {
    const strictTool: ToolDefinition = {
      name: "strict",
      description: "Requires a specific key",
      inputSchema: z.object({ required: z.string() }),
      execute: async (input) => input as JsonValue,
    };

    const scenario = new Scenario();
    scenario.withTools([strictTool]);

    scriptToolCallTurn(scenario, [
      { toolCallId: "call-1", toolName: "strict", input: { wrong: "key" } },
    ]);
    scriptTextReply(scenario, "Fixed");

    await scenario.sendMessage("send bad input");

    const result = scenario.messages[2] as ToolResultEntry;
    expect(result.outcome).toBe("error");
    expect(result.toolName).toBe("strict");

    expect(scenario.messages[3]).toEqual({
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Fixed" }],
    });
  });

  test("multiple tool calls in one message produce results in call order", async () => {
    const scenario = new Scenario();
    scenario.withTools([echoTool]);

    scriptToolCallTurn(scenario, [
      { toolCallId: "call-a", toolName: "echo", input: { n: 1 } },
      { toolCallId: "call-b", toolName: "echo", input: { n: 2 } },
    ]);
    scriptTextReply(scenario, "Both done");

    await scenario.sendMessage("echo twice");

    const resultA: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-a",
      toolName: "echo",
      output: { echoed: { n: 1 } },
      outcome: "success",
    };
    const resultB: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-b",
      toolName: "echo",
      output: { echoed: { n: 2 } },
      outcome: "success",
    };

    expect(scenario.messages[2]).toEqual(resultA);
    expect(scenario.messages[3]).toEqual(resultB);
    expect(scenario.messages[4]).toEqual({
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Both done" }],
    });

    const toolResultEvents = scenario.events.filter(
      (e) => e.type === "tool-result",
    );
    expect(toolResultEvents).toEqual([
      { type: "tool-result", result: resultA },
      { type: "tool-result", result: resultB },
    ]);
  });
});
