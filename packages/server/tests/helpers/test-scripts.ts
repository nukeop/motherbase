import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import type { ModelChunk } from "../../src/agent/model-chunk";
import { createStream, toStreamParts } from "./mock-model";

type ModelScript = {
  chunks: ModelChunk[];
  error?: string;
};

const key = (providerId: string, modelId: string) => `${providerId}:${modelId}`;

export class TestScripts {
  #scripts = new Map<string, ModelScript[]>();

  enqueue(providerId: string, modelId: string, script: ModelScript): void {
    const queue = this.#scripts.get(key(providerId, modelId)) ?? [];
    queue.push(script);
    this.#scripts.set(key(providerId, modelId), queue);
  }

  buildStream(
    providerId: string,
    modelId: string,
  ): ReadableStream<LanguageModelV3StreamPart> {
    const script = this.#scripts.get(key(providerId, modelId))?.shift();
    if (!script) {
      throw new Error(`No script registered for ${providerId}:${modelId}`);
    }
    const parts = toStreamParts(script.chunks);
    const error = script.error ? new Error(script.error) : undefined;
    return createStream(parts, error);
  }
}
