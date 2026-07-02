import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import type { AgentEvent } from "@motherbase/core";
import type { ModelChunk } from "../../src/agent/model-chunk";
import { createModelClient } from "../../src/agent/model-client";
import { Runner } from "../../src/agent/runner";
import type { ToolDefinition } from "../../src/agent/tools/definition";
import { createSession, getHistory } from "../../src/sessions/store";
import { createMockModel, createStream, toStreamParts } from "./mock-model";

export class Scenario {
  readonly session = createSession({
    projectId: crypto.randomUUID(),
    providerId: "test",
    modelId: "test-model",
  });
  readonly events: AgentEvent[] = [];
  #streamQueue: Array<() => ReadableStream<LanguageModelV3StreamPart>> = [];
  #tools: readonly ToolDefinition[] = [];
  #runner!: Runner;

  get runner(): Runner {
    return this.#runner;
  }

  get messages() {
    return getHistory(this.session.id);
  }

  get tools(): readonly ToolDefinition[] {
    return this.#tools;
  }

  withTools(tools: readonly ToolDefinition[]): void {
    this.#tools = tools;
  }

  scriptTurn(chunks: ModelChunk[]): void {
    const parts = toStreamParts(chunks);
    this.#streamQueue.push(() => createStream(parts));
  }

  scriptError(chunks: ModelChunk[], errorMessage: string): void {
    const parts = toStreamParts(chunks);
    this.#streamQueue.push(() => createStream(parts, new Error(errorMessage)));
  }

  async sendMessage(text: string): Promise<void> {
    this.#runner = new Runner(this.session.id, {
      model: createModelClient(createMockModel(() => this.#nextStream())),
      emit: (event) => this.events.push(event),
    });
    await this.#runner.send({
      kind: "message",
      role: "user",
      parts: [{ type: "text", text }],
    });
  }

  #nextStream(): ReadableStream<LanguageModelV3StreamPart> {
    const factory = this.#streamQueue.shift();
    if (!factory) {
      throw new Error(
        "Model stream requested but no scripted response is queued; " +
          "script one response per streaming cycle",
      );
    }
    return factory();
  }
}
