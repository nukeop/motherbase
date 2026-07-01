import { z } from "zod";
import {
  errorEntrySchema,
  messageEntrySchema,
  messagePartSchema,
  toolResultEntrySchema,
} from "./history";

export const messageInProgressSchema = z.object({
  type: z.literal("message-in-progress"),
  parts: z.array(messagePartSchema),
});
export const messageCompletedSchema = z.object({
  type: z.literal("message-completed"),
  message: messageEntrySchema,
});
export const toolResultEventSchema = z.object({
  type: z.literal("tool-result"),
  result: toolResultEntrySchema,
});
export const errorSchema = z.object({
  type: z.literal("error"),
  error: errorEntrySchema,
});
export const turnCompletedSchema = z.object({
  type: z.literal("turn-completed"),
});

export const agentEventSchema = z.discriminatedUnion("type", [
  messageInProgressSchema,
  messageCompletedSchema,
  toolResultEventSchema,
  errorSchema,
  turnCompletedSchema,
]);

export type AgentEvent = z.infer<typeof agentEventSchema>;
