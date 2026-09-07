import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";
import type { ModelChunk } from "../../src/agent/model-chunk";
import { createModelClient } from "../../src/agent/model-client";
import { SessionPermissions } from "../../src/agent/permissions/session-permissions";
import { Runner } from "../../src/agent/runner";
import type { ToolDefinition } from "../../src/agent/tools/definition";
import type { Authorize } from "../../src/agent/types";
import { bus } from "../../src/events";
import type {
  EventName,
  ServerEvent,
  ServerEvents,
} from "../../src/events/server-events";
import { createSession, getHistory } from "../../src/sessions/store";
import {
  createMockModel,
  createStream,
  toStreamParts,
} from "../mocks/mock-model";

export class Scenario {
  readonly session = createSession({
    projectId: crypto.randomUUID(),
    providerId: "test",
    modelId: "test-model",
  });
  readonly events: ServerEvent[] = [];
  #streamQueue: Array<() => ReadableStream<LanguageModelV3StreamPart>> = [];
  #tools: readonly ToolDefinition[] = [];
  #permissions: SessionPermissions | null = null;
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

  withPermissions(): void {
    this.#permissions = new SessionPermissions(this.session.id, null);
  }

  waitFor<Name extends EventName>(name: Name): Promise<ServerEvents[Name]> {
    return new Promise((resolve) => {
      const off = bus.on(this.session.id, name, (payload) => {
        off();
        resolve(payload);
      });
    });
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
      tools: () => this.#tools,
      authorize: this.#authorize(),
    });
    const off = bus.on(this.session.id, "*", (event) => {
      this.events.push(event);
    });
    try {
      await this.#runner.send({
        kind: "message",
        role: "user",
        parts: [{ type: "text", text }],
      });
    } finally {
      off();
    }
  }

  #authorize(): Authorize {
    const permissions = this.#permissions;
    if (permissions) {
      return (toolName, claim) => permissions.authorize(toolName, claim);
    }
    return async () => {};
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
