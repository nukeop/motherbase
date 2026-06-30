import { projectForModel } from "@motherbase/core";
import { getHistory } from "../../sessions/store";
import type { StateHandler } from "../types";

export const preparingContext: StateHandler = async (ctx) => {
  const history = getHistory(ctx.sessionId);
  ctx.messages = projectForModel(history);
  return { type: "streaming" };
};
