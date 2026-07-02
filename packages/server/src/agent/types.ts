import type {
  AgentEvent,
  HandlerState,
  MessageEntry,
  ModelEntry,
} from "@motherbase/core";
import type { MessageDraft } from "./message-draft";
import type { ModelClient } from "./model-client";

export type StateHandler = (
  ctx: RunContext,
) => Promise<{ type: HandlerState } | null>;

export type RunContext = {
  sessionId: string;
  model: ModelClient;
  emit: (event: AgentEvent) => void;
  userMessage: MessageEntry;
  modelContext: ModelEntry[];
  draft: MessageDraft;
  error: Error | null;
};
