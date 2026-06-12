import { z } from "zod";
import { type HistoryEntry, historyEntrySchema } from "./history";

export const sessionSnapshotSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  parentSessionId: z.uuid().nullable(),
  history: z.array(historyEntrySchema),
});

export type SessionSnapshot = z.infer<typeof sessionSnapshotSchema>;

export class Session {
  #history: HistoryEntry[];

  private constructor(
    readonly id: string,
    readonly projectId: string,
    readonly parentSessionId: string | null,
    history: HistoryEntry[],
  ) {
    this.#history = history;
  }

  static create(input: { projectId: string }): Session {
    return new Session(crypto.randomUUID(), input.projectId, null, []);
  }

  get history(): readonly HistoryEntry[] {
    return this.#history;
  }

  snapshot(): SessionSnapshot {
    return sessionSnapshotSchema.parse({
      id: this.id,
      projectId: this.projectId,
      parentSessionId: this.parentSessionId,
      history: this.#history,
    });
  }
}
