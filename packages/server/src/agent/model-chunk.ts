import { jsonValueSchema } from "@motherbase/core";
import { z } from "zod";

export const textStartSchema = z.object({
  type: z.literal("text-start"),
});
export const textDeltaSchema = z.object({
  type: z.literal("text-delta"),
  text: z.string(),
});
export const reasoningStartSchema = z.object({
  type: z.literal("reasoning-start"),
});
export const reasoningDeltaSchema = z.object({
  type: z.literal("reasoning-delta"),
  text: z.string(),
});
export const toolCallChunkSchema = z.object({
  type: z.literal("tool-call"),
  toolCallId: z.string(),
  toolName: z.string(),
  input: jsonValueSchema,
});
export const finishReasonSchema = z.enum(["stop", "tool-calls"]);
export const finishChunkSchema = z.object({
  type: z.literal("finish"),
  reason: finishReasonSchema,
});

export const modelChunkSchema = z.discriminatedUnion("type", [
  textStartSchema,
  textDeltaSchema,
  reasoningStartSchema,
  reasoningDeltaSchema,
  toolCallChunkSchema,
  finishChunkSchema,
]);

export type ModelChunk = z.infer<typeof modelChunkSchema>;
export type FinishReason = z.infer<typeof finishReasonSchema>;
