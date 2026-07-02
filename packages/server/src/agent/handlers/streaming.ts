import { toError } from "@motherbase/core";
import type { StateHandler } from "../types";

export const streaming: StateHandler = async (ctx) => {
  const draft = ctx.draft!;
  try {
    const chunks = ctx.model.stream(ctx.modelContext, ctx.tools);
    for await (const chunk of chunks) {
      if (chunk.type === "finish") {
        ctx.finishReason = chunk.reason;
        continue;
      }
      draft.push(chunk);
      ctx.emit({
        type: "message-in-progress",
        parts: draft.parts.map((part) => ({ ...part })),
      });
    }
  } catch (err) {
    ctx.error = toError(err);
    return { type: "error" };
  }

  return { type: "completing" };
};
