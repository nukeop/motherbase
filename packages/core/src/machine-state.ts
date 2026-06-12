import { z } from "zod";
import { messageEntrySchema } from "./history";

export const machineStateSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("idle") }),
  z.object({
    type: z.literal("preparing-context"),
    message: messageEntrySchema,
  }),
  z.object({ type: z.literal("generating") }),
]);

export type MachineState = z.infer<typeof machineStateSchema>;
