import { z } from "zod";

export const stateSchema = z.enum([
  "idle",
  "message-received",
  "preparing-context",
  "streaming",
  "completing",
  "error",
]);

export type State = z.infer<typeof stateSchema>;

export const machineStateSchema = z.object({ type: stateSchema });

export type MachineState = z.infer<typeof machineStateSchema>;
