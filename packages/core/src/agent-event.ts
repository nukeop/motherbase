import { z } from "zod";
import { messageEntrySchema } from "./history";

export const agentEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text-delta"), text: z.string() }),
  z.object({ type: z.literal("reasoning-delta"), text: z.string() }),
  z.object({
    type: z.literal("message-completed"),
    message: messageEntrySchema,
  }),
  z.object({ type: z.literal("turn-completed") }),
]);

export type AgentEvent = z.infer<typeof agentEventSchema>;
