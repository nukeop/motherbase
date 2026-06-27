import { z } from "zod";

export const messagePartSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({ type: z.literal("reasoning"), text: z.string() }),
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

export const historyEntrySchema = z.discriminatedUnion("kind", [
  messageEntrySchema,
  errorEntrySchema,
]);

export type MessagePart = z.infer<typeof messagePartSchema>;
export type MessageRole = z.infer<typeof messageRoleSchema>;
export type MessageEntry = z.infer<typeof messageEntrySchema>;
export type ErrorOrigin = z.infer<typeof errorOriginSchema>;
export type ErrorEntry = z.infer<typeof errorEntrySchema>;
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

export const projectForModel = (
  history: readonly HistoryEntry[],
): MessageEntry[] => history.filter((entry) => entry.kind === "message");
