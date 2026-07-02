import { toError } from "@motherbase/core";
import type { StateHandler } from "../types";

export const streaming: StateHandler = async (ctx) => {
  try {
    const chunks = ctx.model.stream(ctx.modelContext, []);
    for await (const chunk of chunks) {
      if (chunk.type === "finish") {
        continue;
      }
      ctx.draft.push(chunk);
      ctx.emit({
        type: "message-in-progress",
        parts: ctx.draft.parts.map((part) => ({ ...part })),
      });
    }
  } catch (err) {
    ctx.error = toError(err);
    return { type: "error" };
  }

  return { type: "completing" };
};
