import { appendEntry } from "../../sessions/store";
import type { StateHandler } from "../types";

export const completing: StateHandler = async (ctx) => {
  const reply = ctx.draft.complete();
  appendEntry(ctx.sessionId, reply);
  ctx.emit({ type: "message-completed", message: reply });
  return null;
};
