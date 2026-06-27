import { z } from "zod";
import { messageEntrySchema, messagePartSchema } from "./history";

export const textDeltaSchema = z.object({ type: z.literal("text-delta"), text: z.string() });
export const reasoningDeltaSchema = z.object({ type: z.literal("reasoning-delta"), text: z.string() });
export const messageInProgressSchema = z.object({ type: z.literal("message-in-progress"), parts: z.array(messagePartSchema) });
export const messageCompletedSchema = z.object({ type: z.literal("message-completed"), message: messageEntrySchema });
export const turnCompletedSchema = z.object({ type: z.literal("turn-completed") });

export const agentEventSchema = z.discriminatedUnion("type", [
  textDeltaSchema,
  reasoningDeltaSchema,
  messageInProgressSchema,
  messageCompletedSchema,
  turnCompletedSchema,
]);

export type AgentEvent = z.infer<typeof agentEventSchema>;
