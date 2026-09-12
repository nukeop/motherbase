import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import type { ModelChunk } from "../../src/agent/model-chunk";
import { createStream, toStreamParts } from "../mocks/mock-model";

type ModelScript = {
  chunks: ModelChunk[];
  error?: string;
};

type ProviderScripts = Map<string, ModelScript[]>;

export class TestScripts {
  #providers = new Map<string, ProviderScripts>();

  forget(providerId: string): void {
    this.#providers.delete(providerId);
  }

  enqueue(providerId: string, modelId: string, script: ModelScript): void {
    const provider = this.#providers.get(providerId) ?? new Map();
    const queue = provider.get(modelId) ?? [];
    queue.push(script);
    provider.set(modelId, queue);
    this.#providers.set(providerId, provider);
  }

  buildStream(
    providerId: string,
    modelId: string,
  ): ReadableStream<LanguageModelV3StreamPart> {
    const script = this.#providers.get(providerId)?.get(modelId)?.shift();
    if (!script) {
      throw new Error(`No script registered for ${providerId}:${modelId}`);
    }
    const parts = toStreamParts(script.chunks);
    const error = script.error ? new Error(script.error) : undefined;
    return createStream(parts, error);
  }
}
