import { getLogger } from "@logtape/logtape";
import type { ErrorEntry } from "@motherbase/core";
import { appendEntry } from "../../sessions/store";
import type { StateHandler } from "../types";

const logger = getLogger(["Motherbase", "Agent", "Error"]);

export const error: StateHandler = async (ctx) => {
  logger.error`Model stream error: ${ctx.error}`;

  if (ctx.draft.parts.length > 0) {
    appendEntry(ctx.sessionId, ctx.draft.complete());
  }

  const entry: ErrorEntry = {
    kind: "error",
    origin: "provider",
    message: ctx.error!.message,
  };
  appendEntry(ctx.sessionId, entry);
  ctx.emit({ type: "error", error: entry });

  return null;
};
