import { getLogger } from "@logtape/logtape";
import {
  type AgentEvent,
  type MachineState,
  type MessageEntry,
  projectForModel,
} from "@motherbase/core";
import { appendMessage, getMessages } from "../sessions/store";
import { MessageDraft } from "./message-draft";
import type { ModelClient } from "./model-client";

const logger = getLogger(["Motherbase", "Agent", "Runner"]);

export type Deps = {
  model: ModelClient;
  emit: (event: AgentEvent) => void;
};

export class Runner {
  #state: MachineState = { type: "idle" };

  constructor(
    private readonly sessionId: string,
    private readonly deps: Deps,
  ) {}

  get state(): MachineState {
    return this.#state;
  }

  async send(message: MessageEntry): Promise<void> {
    appendMessage(this.sessionId, message);
    const draft = new MessageDraft();
    const history = getMessages(this.sessionId);
    const chunks = this.deps.model.stream(projectForModel(history));
    for await (const chunk of chunks) {
      if (chunk.type === "finish") {
        continue;
      }
      draft.push(chunk);
      this.deps.emit({
        type: "message-in-progress",
        parts: draft.parts.map((part) => ({ ...part })),
      });
    }
    const reply = draft.complete();
    appendMessage(this.sessionId, reply);
    this.deps.emit({ type: "message-completed", message: reply });
    this.deps.emit({ type: "turn-completed" });
  }
}
