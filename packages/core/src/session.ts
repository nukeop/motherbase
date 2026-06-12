import { z } from "zod";
import { historyEntrySchema } from "./history";

export const sessionSnapshotSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  parentSessionId: z.uuid().nullable(),
  history: z.array(historyEntrySchema),
});

export type SessionSnapshot = z.infer<typeof sessionSnapshotSchema>;
