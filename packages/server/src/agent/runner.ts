import {
  type AgentEvent,
  type MachineState,
  type MessageEntry,
  projectForModel,
  type Session,
} from "@motherbase/core";
import { MessageDraft } from "./message-draft";
import type { ModelClient } from "./model-client";

export type Deps = {
  model: ModelClient;
  emit: (event: AgentEvent) => void;
};

export class Runner {
  #state: MachineState = { type: "idle" };

  constructor(
    private readonly session: Session,
    private readonly deps: Deps,
  ) {}

  get state(): MachineState {
    return this.#state;
  }

  async send(message: MessageEntry): Promise<void> {
    this.session.append(message);
    const draft = new MessageDraft();
    const chunks = this.deps.model.stream(projectForModel(this.session.history));
    for await (const chunk of chunks) {
      if (chunk.type === "finish") {
        continue;
      }
      this.deps.emit({ type: chunk.type, text: chunk.text });
      draft.push(chunk);
    }
    const reply = draft.complete();
    this.session.append(reply);
    this.deps.emit({ type: "message-completed", message: reply });
    this.deps.emit({ type: "turn-completed" });
  }
}
