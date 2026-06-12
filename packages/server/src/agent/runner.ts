import type {
  AgentEvent,
  MachineState,
  MessageEntry,
  Session,
} from "@motherbase/core";
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

  async send(message: MessageEntry): Promise<void> {}
}
