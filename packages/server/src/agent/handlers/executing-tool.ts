import { getLogger } from "@logtape/logtape";
import {
  type JsonValue,
  type ToolCallPart,
  type ToolOutcome,
  type ToolResultEntry,
  toError,
} from "@motherbase/core";
import { z } from "zod";
import { appendEntry } from "../../sessions/store";
import { type ToolDefinition, ToolError } from "../tools/definition";
import { bus } from "../../events";
import type { Authorize, StateHandler } from "../types";

const logger = getLogger(["Motherbase", "Agent", "ExecutingTool"]);

export const executingTool: StateHandler = async (ctx) => {
  if (!ctx.reply) {
    throw new Error(
      "Reached executing-tool without a completed reply. This should never happen",
    );
  }

  const calls = ctx.reply.parts.filter((part) => part.type === "tool-call");
  for (const call of calls) {
    const result = await executeCall(ctx.tools, ctx.authorize, call);
    appendEntry(ctx.sessionId, result);
    bus.emit(ctx.sessionId, { type: "tool-result", result });
  }

  return { type: "preparing-context" };
};

const executeCall = async (
  tools: readonly ToolDefinition[],
  authorize: Authorize,
  call: ToolCallPart,
): Promise<ToolResultEntry> => {
  const tool = tools.find((candidate) => candidate.name === call.toolName);
  if (!tool) {
    return toResult(call, "error", `No such tool: ${call.toolName}`);
  }

  const parsed = tool.inputSchema.safeParse(call.input);
  if (!parsed.success) {
    return toResult(call, "error", z.prettifyError(parsed.error));
  }

  try {
    if (tool.claim) {
      await authorize(call.toolName, tool.claim(parsed.data));
    }
    return toResult(call, "success", await tool.execute(parsed.data));
  } catch (err) {
    if (err instanceof ToolError) {
      return toResult(call, "error", err.message);
    }
    const error = toError(err);
    logger.error("Tool {toolName} crashed: {message}", {
      toolName: call.toolName,
      message: error.message,
    });
    return toResult(call, "crash", error.message);
  }
};

const toResult = (
  call: ToolCallPart,
  outcome: ToolOutcome,
  output: JsonValue,
): ToolResultEntry => ({
  kind: "tool-result",
  toolCallId: call.toolCallId,
  toolName: call.toolName,
  output,
  outcome,
});
