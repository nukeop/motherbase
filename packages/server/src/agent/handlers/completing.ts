import { appendEntry } from "../../sessions/store";
import { bus } from "../../events";
import type { StateHandler } from "../types";

export const completing: StateHandler = async (ctx) => {
  const reply = ctx.draft!.complete();
  appendEntry(ctx.sessionId, reply);
  ctx.reply = reply;
  bus.emit(ctx.sessionId, "message-completed", { message: reply });

  if (ctx.finishReason === "tool-calls") {
    return { type: "executing-tool" };
  }
  return null;
};
