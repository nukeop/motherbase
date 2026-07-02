import type { ModelEntry } from "@motherbase/core";
import { jsonValueSchema, toError } from "@motherbase/core";
import { type LanguageModel, streamText } from "ai";
import {
  type FinishReason,
  finishReasonSchema,
  type ModelChunk,
} from "./model-chunk";
import { toModelMessages } from "./model-messages";
import { toSdkTools } from "./model-tools";
import type { ToolDefinition } from "./tools/definition";

export type ModelClient = {
  stream: (
    entries: readonly ModelEntry[],
    tools: readonly ToolDefinition[],
  ) => AsyncIterable<ModelChunk>;
};

export const createModelClient = (model: LanguageModel): ModelClient => ({
  stream: (entries, tools) => streamChunks(model, entries, tools),
});

const toFinishReason = (reason: string): FinishReason => {
  const parsed = finishReasonSchema.safeParse(reason);
  if (!parsed.success) {
    throw new Error(`Unsupported finish reason: ${reason}`);
  }
  return parsed.data;
};

async function* streamChunks(
  model: LanguageModel,
  entries: readonly ModelEntry[],
  tools: readonly ToolDefinition[],
): AsyncIterable<ModelChunk> {
  const result = streamText({
    model,
    messages: toModelMessages(entries),
    tools: toSdkTools(tools),
    // Suppresses the SDK's default console.error
    onError: () => {},
  });
  for await (const part of result.fullStream) {
    switch (part.type) {
      case "text-start":
        yield { type: "text-start" };
        break;
      case "text-delta":
        yield { type: "text-delta", text: part.text };
        break;
      case "reasoning-start":
        yield { type: "reasoning-start" };
        break;
      case "reasoning-delta":
        yield { type: "reasoning-delta", text: part.text };
        break;
      case "tool-call":
        yield {
          type: "tool-call",
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          input: jsonValueSchema.parse(part.input),
        };
        break;
      case "finish":
        yield { type: "finish", reason: toFinishReason(part.finishReason) };
        break;
      case "error":
        throw toError(part.error);
      default:
        break;
    }
  }
}
