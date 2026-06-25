import { reasoningDeltaSchema, textDeltaSchema } from "@motherbase/core";
import { z } from "zod";

export const finishChunkSchema = z.object({ type: z.literal("finish"), reason: z.literal("stop") });

export const modelChunkSchema = z.discriminatedUnion("type", [
  textDeltaSchema,
  reasoningDeltaSchema,
  finishChunkSchema,
]);

export type ModelChunk = z.infer<typeof modelChunkSchema>;
export type FinishReason = "stop";
