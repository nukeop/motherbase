import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import type { ModelChunk } from "../../src/agent/model-client";

type BlockKind = "text" | "reasoning";
type CurrentBlock = {
  kind: BlockKind;
  id: string;
}

const toStreamParts = (chunks: ModelChunk[]): LanguageModelV3StreamPart[] => {
  const parts: LanguageModelV3StreamPart[] = [];
  let openBlock: CurrentBlock | null = null;

  const closeBlock = () => {
    parts.push({ type: `${openBlock!.kind}-end`, id: openBlock!.id });
    openBlock = null;
  };

  const openBlockFor = (kind: BlockKind) => {
    if (openBlock && openBlock.kind !== kind) {
      // This means we're transitioning from reasoning to talking or vice versa
      closeBlock();
    }

    if (openBlock) {
      // This means we're processing the next chunk of the same block
      return openBlock;
    }

    openBlock = { kind, id: crypto.randomUUID() }
    parts.push({ type: `${kind}-start`, id: openBlock.id })
    return openBlock;
  }

  chunks.forEach((chunk) => {
    switch (chunk.type) {
      case "text-delta":
        parts.push({
          type: "text-delta",
          id: openBlockFor("text").id,
          delta: chunk.text,
        });
        break;
      case "reasoning-delta":
        parts.push({
          type: "reasoning-delta",
          id: openBlockFor("reasoning").id,
          delta: chunk.text,
        });
        break;
      case "finish":
        closeBlock();
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
  })
  return parts;
};

export const createMockModel = (chunks: ModelChunk[]) =>
  new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({ chunks: toStreamParts(chunks) }),
    }),
  });
