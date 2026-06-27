import { z } from "zod";
import { messageEntrySchema, messagePartSchema } from "./history";

export const messageInProgressSchema = z.object({ type: z.literal("message-in-progress"), parts: z.array(messagePartSchema) });
export const messageCompletedSchema = z.object({ type: z.literal("message-completed"), message: messageEntrySchema });
export const turnCompletedSchema = z.object({ type: z.literal("turn-completed") });

export const agentEventSchema = z.discriminatedUnion("type", [
  messageInProgressSchema,
  messageCompletedSchema,
  turnCompletedSchema,
]);

export type AgentEvent = z.infer<typeof agentEventSchema>;
