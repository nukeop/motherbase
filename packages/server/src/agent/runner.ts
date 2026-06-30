import { getLogger } from "@logtape/logtape";
import type {
  AgentEvent,
  HandlerState,
  MachineState,
  MessageEntry,
} from "@motherbase/core";
import { completing } from "./handlers/completing";
import { error } from "./handlers/error";
import { messageReceived } from "./handlers/message-received";
import { preparingContext } from "./handlers/preparing-context";
import { streaming } from "./handlers/streaming";
import { MessageDraft } from "./message-draft";
import type { ModelClient } from "./model-client";
import type { RunContext, StateHandler } from "./types";

const logger = getLogger(["Motherbase", "Agent", "Runner"]);

const handlers: Record<HandlerState, StateHandler> = {
  "message-received": messageReceived,
  "preparing-context": preparingContext,
  streaming,
  completing,
  error,
};

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
    const ctx: RunContext = {
      sessionId: this.sessionId,
      model: this.deps.model,
      emit: this.deps.emit,
      message,
      messages: [],
      draft: new MessageDraft(),
      error: null,
    };

    await this.run({ type: "message-received" }, ctx);
    this.deps.emit({ type: "turn-completed" });
  }

  private async run(state: MachineState & { type: HandlerState }, ctx: RunContext): Promise<void> {
    this.#state = state;
    const next = await handlers[state.type](ctx);

    if (!next) {
      this.#state = { type: "idle" };
      return;
    }

    return this.run(next, ctx);
  }
}
