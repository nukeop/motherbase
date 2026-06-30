import { appendEntry } from "../../sessions/store";
import type { StateHandler } from "../types";

export const messageReceived: StateHandler = async (ctx) => {
  appendEntry(ctx.sessionId, ctx.message);
  return { type: "preparing-context" };
};
