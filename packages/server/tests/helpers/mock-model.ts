import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import { MockLanguageModelV3 } from "ai/test";
import type { ModelChunk } from "../../src/agent/model-chunk";

type BlockKind = "text" | "reasoning";
type OpenBlock = {
  kind: BlockKind;
  id: string;
};

export const toStreamParts = (
  chunks: ModelChunk[],
): LanguageModelV3StreamPart[] => {
  const parts: LanguageModelV3StreamPart[] = [];
  let openBlock: OpenBlock | null = null;

  const close = () => {
    if (openBlock !== null) {
      parts.push({ type: `${openBlock.kind}-end`, id: openBlock.id });
      openBlock = null;
    }
  };

  const open = (kind: BlockKind) => {
    close();
    openBlock = { kind, id: crypto.randomUUID() };
    parts.push({ type: `${kind}-start`, id: openBlock.id });
  };

  const delta = (kind: BlockKind, text: string) => {
    if (openBlock === null || openBlock.kind !== kind) {
      throw new Error(
        `Scripted a ${kind} delta without opening a ${kind} block first`,
      );
    }
    parts.push({ type: `${kind}-delta`, id: openBlock.id, delta: text });
  };

  for (const chunk of chunks) {
    switch (chunk.type) {
      case "text-start":
        open("text");
        break;
      case "text-delta":
        delta("text", chunk.text);
        break;
      case "reasoning-start":
        open("reasoning");
        break;
      case "reasoning-delta":
        delta("reasoning", chunk.text);
        break;
      case "tool-call":
        close();
        parts.push({
          type: "tool-call",
          toolCallId: chunk.toolCallId,
          toolName: chunk.toolName,
          input: JSON.stringify(chunk.input),
        });
        break;
      case "finish":
        close();
        // TODO: Allow setting usage
        parts.push({
          type: "finish",
          finishReason: { unified: chunk.reason, raw: chunk.reason },
          usage: {
            inputTokens: { total: 0, noCache: 0, cacheRead: 0, cacheWrite: 0 },
            outputTokens: { total: 0, text: 0, reasoning: 0 },
          },
        });
        break;
    }
  }
  return parts;
};

export const createStream = (
  parts: LanguageModelV3StreamPart[],
  error?: Error,
) =>
  new ReadableStream<LanguageModelV3StreamPart>({
    start(controller) {
      for (const part of parts) {
        controller.enqueue(part);
      }
      if (error) {
        controller.error(error);
      } else {
        controller.close();
      }
    },
  });

export const createMockModel = (
  nextStream: () => ReadableStream<LanguageModelV3StreamPart>,
) =>
  new MockLanguageModelV3({
    doStream: async () => ({ stream: nextStream() }),
  });
