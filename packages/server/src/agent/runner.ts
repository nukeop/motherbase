import { getLogger } from "@logtape/logtape";
import type {
  AgentEvent,
  HandlerState,
  MachineState,
  MessageEntry,
} from "@motherbase/core";
import { completing } from "./handlers/completing";
import { error } from "./handlers/error";
import { executingTool } from "./handlers/executing-tool";
import { messageReceived } from "./handlers/message-received";
import { preparingContext } from "./handlers/preparing-context";
import { streaming } from "./handlers/streaming";
import type { ModelClient } from "./model-client";
import type { ToolDefinition } from "./tools/definition";
import type { RunContext, StateHandler } from "./types";

const logger = getLogger(["Motherbase", "Agent", "Runner"]);

const handlers: Record<HandlerState, StateHandler> = {
  "message-received": messageReceived,
  "preparing-context": preparingContext,
  streaming,
  completing,
  "executing-tool": executingTool,
  error,
};

export type Deps = {
  model: ModelClient;
  tools: () => readonly ToolDefinition[];
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

  async send(userMessage: MessageEntry): Promise<void> {
    const ctx: RunContext = {
      sessionId: this.sessionId,
      model: this.deps.model,
      emit: this.deps.emit,
      userMessage,
      modelContext: [],
      tools: this.deps.tools(),
      draft: null,
      finishReason: null,
      reply: null,
      error: null,
    };

    await this.run({ type: "message-received" }, ctx);
    this.deps.emit({ type: "turn-completed" });
  }

  private async run(
    state: MachineState & { type: HandlerState },
    ctx: RunContext,
  ): Promise<void> {
    this.#state = state;
    const next = await handlers[state.type](ctx);

    if (!next) {
      this.#state = { type: "idle" };
      return;
    }

    return this.run(next, ctx);
  }
}
