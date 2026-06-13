import { type AgentEvent, Session } from "@motherbase/core";
import {
  createModelClient,
  type ModelChunk,
} from "../../src/agent/model-client";
import { Runner } from "../../src/agent/runner";
import { createMockModel } from "./mock-model";

export class Scenario {
  readonly session = Session.create({ projectId: crypto.randomUUID() });
  readonly events: AgentEvent[] = [];
  #script!: ModelChunk[];
  #runner!: Runner;

  get runner(): Runner {
    return this.#runner;
  }

  scriptTurn(chunks: ModelChunk[]): void {
    this.#script = chunks;
  }

  async sendMessage(text: string): Promise<void> {
    this.#runner = new Runner(this.session, {
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
