import { z } from "zod";
import { jsonValueSchema } from "./json";

export const messagePartSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({ type: z.literal("reasoning"), text: z.string() }),
  z.object({
    type: z.literal("tool-call"),
    toolCallId: z.string(),
    toolName: z.string(),
    input: jsonValueSchema,
  }),
]);

export const messageRoleSchema = z.enum(["user", "assistant"]);

export const messageEntrySchema = z.object({
  kind: z.literal("message"),
  role: messageRoleSchema,
  parts: z.array(messagePartSchema),
});

export const errorOriginSchema = z.enum(["provider", "internal"]);

export const errorEntrySchema = z.object({
  kind: z.literal("error"),
  origin: errorOriginSchema,
  message: z.string(),
});

export const toolOutcomeSchema = z.enum(["success", "error", "crash"]);

export const toolResultEntrySchema = z.object({
  kind: z.literal("tool-result"),
  toolCallId: z.string(),
  toolName: z.string(),
  output: jsonValueSchema,
  outcome: toolOutcomeSchema,
});

export const historyEntrySchema = z.discriminatedUnion("kind", [
  messageEntrySchema,
  errorEntrySchema,
  toolResultEntrySchema,
]);

export type MessagePart = z.infer<typeof messagePartSchema>;
export type MessageRole = z.infer<typeof messageRoleSchema>;
export type MessageEntry = z.infer<typeof messageEntrySchema>;
export type ErrorOrigin = z.infer<typeof errorOriginSchema>;
export type ErrorEntry = z.infer<typeof errorEntrySchema>;
export type ToolOutcome = z.infer<typeof toolOutcomeSchema>;
export type ToolResultEntry = z.infer<typeof toolResultEntrySchema>;
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

export type ModelEntry = MessageEntry | ToolResultEntry;

export const projectForModel = (
  history: readonly HistoryEntry[],
): ModelEntry[] =>
  history.filter(
    (entry) => entry.kind === "message" || entry.kind === "tool-result",
  );
