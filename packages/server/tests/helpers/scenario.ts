import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import type { AgentEvent } from "@motherbase/core";
import type { ModelChunk } from "../../src/agent/model-chunk";
import { createModelClient } from "../../src/agent/model-client";
import { Runner } from "../../src/agent/runner";
import { createSession, getHistory } from "../../src/sessions/store";
import { createMockModel, createStream, toStreamParts } from "./mock-model";

export class Scenario {
  readonly session = createSession({
    projectId: crypto.randomUUID(),
    providerId: "test",
    modelId: "test-model",
  });
  readonly events: AgentEvent[] = [];
  #streamFactory!: () => ReadableStream<LanguageModelV3StreamPart>;
  #runner!: Runner;

  get runner(): Runner {
    return this.#runner;
  }

  get messages() {
    return getHistory(this.session.id);
  }

  scriptTurn(chunks: ModelChunk[]): void {
    const parts = toStreamParts(chunks);
    this.#streamFactory = () => createStream(parts);
  }

  scriptError(chunks: ModelChunk[], errorMessage: string): void {
    const parts = toStreamParts(chunks);
    this.#streamFactory = () => createStream(parts, new Error(errorMessage));
  }

  async sendMessage(text: string): Promise<void> {
    this.#runner = new Runner(this.session.id, {
      model: createModelClient(createMockModel(this.#streamFactory())),
      emit: (event) => this.events.push(event),
    });
    await this.#runner.send({
      kind: "message",
      role: "user",
      parts: [{ type: "text", text }],
    });
  }
}
