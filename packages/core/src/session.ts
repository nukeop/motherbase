import { z } from "zod";
import { type HistoryEntry, historyEntrySchema } from "./history";

export const sessionSnapshotSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  parentSessionId: z.uuid().nullable(),
  history: z.array(historyEntrySchema),
});

export type SessionSnapshot = z.infer<typeof sessionSnapshotSchema>;

export type Session = {
  readonly id: string;
  readonly projectId: string;
  readonly parentSessionId: string | null;
  readonly history: readonly HistoryEntry[];
  snapshot: () => SessionSnapshot;
};

export const createSession = (input: { projectId: string }): Session => {
  throw new Error("not implemented");
};

export const loadSession = (snapshot: SessionSnapshot): Session => {
  throw new Error("not implemented");
};
