import { z } from "zod";

export const textDeltaSchema = z.object({ type: z.literal("text-delta"), text: z.string() });
export const reasoningDeltaSchema = z.object({ type: z.literal("reasoning-delta"), text: z.string() });
export const finishChunkSchema = z.object({ type: z.literal("finish"), reason: z.literal("stop") });

export const modelChunkSchema = z.discriminatedUnion("type", [
  textDeltaSchema,
  reasoningDeltaSchema,
  finishChunkSchema,
]);

export type ModelChunk = z.infer<typeof modelChunkSchema>;
export type FinishReason = "stop";
