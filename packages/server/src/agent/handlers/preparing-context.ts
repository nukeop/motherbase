import { projectForModel } from "@motherbase/core";
import { getHistory } from "../../sessions/store";
import { MessageDraft } from "../message-draft";
import type { StateHandler } from "../types";

export const preparingContext: StateHandler = async (ctx) => {
  ctx.draft = new MessageDraft();
  ctx.finishReason = null;
  const history = getHistory(ctx.sessionId);
  ctx.modelContext = projectForModel(history);
  return { type: "streaming" };
};
