import { appendEntry } from "../../sessions/store";
import type { StateHandler } from "../types";

export const completing: StateHandler = async (ctx) => {
  const reply = ctx.draft!.complete();
  appendEntry(ctx.sessionId, reply);
  ctx.reply = reply;
  ctx.emit({ type: "message-completed", message: reply });

  if (ctx.finishReason === "tool-calls") {
    return { type: "executing-tool" };
  }
  return null;
};
