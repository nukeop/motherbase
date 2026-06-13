import { z } from "zod";
import { historyEntrySchema } from "./history";
import { machineStateSchema } from "./machine-state";

export const checkpointSchema = z.object({
  id: z.uuid(),
  parentId: z.uuid().nullable(),
  sessionId: z.uuid(),
  sequence: z.int(),
  state: machineStateSchema,
  history: z.array(historyEntrySchema),
});

export type Checkpoint = z.infer<typeof checkpointSchema>;
