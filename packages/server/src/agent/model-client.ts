import type { MessageEntry } from "@motherbase/core";
import { toError } from "@motherbase/core";
import { type LanguageModel, type ModelMessage, streamText } from "ai";
import type { FinishReason, ModelChunk } from "./model-chunk";

export type ModelClient = {
  stream: (messages: readonly MessageEntry[]) => AsyncIterable<ModelChunk>;
};

export const createModelClient = (model: LanguageModel): ModelClient => ({
  stream: (messages) => streamChunks(model, messages),
});

const toModelMessage = (message: MessageEntry): ModelMessage => {
  if (message.role === "user") {
    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");
    return { role: "user", content: text };
  }
  return { role: "assistant", content: message.parts };
};

const toFinishReason = (reason: string): FinishReason => {
  if (reason === "stop") {
    return "stop";
  }
  throw new Error(`Unsupported finish reason: ${reason}`);
};

async function* streamChunks(
  model: LanguageModel,
  messages: readonly MessageEntry[],
): AsyncIterable<ModelChunk> {
  const result = streamText({
    model,
    messages: messages.map(toModelMessage),
    // Suppresses the SDK's default console.error
    onError: () => { },
  });
  for await (const part of result.fullStream) {
    switch (part.type) {
      case "text-delta":
        yield { type: "text-delta", text: part.text };
        break;
      case "reasoning-delta":
        yield { type: "reasoning-delta", text: part.text };
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
