import { getLogger } from "@logtape/logtape";
import type { MachineState } from "@motherbase/core";
import {
  type AgentEvent,
  type ErrorEntry,
  type MessageEntry,
  projectForModel,
} from "@motherbase/core";
import { appendEntry, getHistory } from "../sessions/store";
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
  ) { }

  get state(): MachineState {
    return this.#state;
  }

  async send(message: MessageEntry): Promise<void> {
    appendEntry(this.sessionId, message);
    const draft = new MessageDraft();
    const history = getHistory(this.sessionId);

    try {
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
      appendEntry(this.sessionId, reply);
      this.deps.emit({ type: "message-completed", message: reply });
    } catch (err) {
      logger.error`Model stream error: ${err}`;

      if (draft.parts.length > 0) {
        appendEntry(this.sessionId, draft.complete());
      }

      const error: ErrorEntry = {
        kind: "error",
        origin: "provider",
        message: err instanceof Error ? err.message : String(err),
      };
      appendEntry(this.sessionId, error);
      this.deps.emit({ type: "error", error });
    }

    this.deps.emit({ type: "turn-completed" });
  }
}
