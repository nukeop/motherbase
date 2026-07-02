import type {
  AgentEvent,
  HandlerState,
  MessageEntry,
  ModelEntry,
} from "@motherbase/core";
import type { MessageDraft } from "./message-draft";
import type { FinishReason } from "./model-chunk";
import type { ModelClient } from "./model-client";
import type { ToolDefinition } from "./tools/definition";

export type StateHandler = (
  ctx: RunContext,
) => Promise<{ type: HandlerState } | null>;

export type RunContext = {
  sessionId: string;
  model: ModelClient;
  emit: (event: AgentEvent) => void;
  userMessage: MessageEntry;
  modelContext: ModelEntry[];
  tools: readonly ToolDefinition[];
  draft: MessageDraft | null;
  finishReason: FinishReason | null;
  reply: MessageEntry | null;
  error: Error | null;
};
