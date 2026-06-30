import type { AgentEvent, MachineState } from "@motherbase/core";
import type { MessageDraft } from "./message-draft";
import type { ModelChunk } from "./model-chunk";
import type { ModelClient } from "./model-client";

export type StateHandler = (ctx: RunContext) => Promise<MachineState | null>;

export type RunContext = {
  sessionId: string;
  model: ModelClient;
  emit: (event: AgentEvent) => void;
  draft: MessageDraft;
  chunks: AsyncIterable<ModelChunk> | null;
  error: Error | null;
};
