import type { AgentEvent } from "@motherbase/core";
import type { ModelChunk } from "../../src/agent/model-chunk";
import { createModelClient } from "../../src/agent/model-client";
import { Runner } from "../../src/agent/runner";
import { createSession, getHistory } from "../../src/sessions/store";
import { createMockModel } from "./mock-model";

export class Scenario {
  readonly session = createSession({
    projectId: crypto.randomUUID(),
    providerId: "test",
    modelId: "test-model",
  });
  readonly events: AgentEvent[] = [];
  #script!: ModelChunk[];
  #runner!: Runner;

  get runner(): Runner {
    return this.#runner;
  }

  get messages() {
    return getHistory(this.session.id);
  }

  scriptTurn(chunks: ModelChunk[]): void {
    this.#script = chunks;
  }

  async sendMessage(text: string): Promise<void> {
    this.#runner = new Runner(this.session.id, {
      model: createModelClient(createMockModel(this.#script)),
      emit: (event) => this.events.push(event),
    });
    await this.#runner.send({
      kind: "message",
      role: "user",
      parts: [{ type: "text", text }],
    });
  }
}
