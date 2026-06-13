import { z } from "zod";
import { type Checkpoint, checkpointSchema } from "./checkpoint";
import { type HistoryEntry, historyEntrySchema } from "./history";
import type { MachineState } from "./machine-state";

export const sessionSnapshotSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  parentSessionId: z.uuid().nullable(),
  history: z.array(historyEntrySchema),
});

export type SessionSnapshot = z.infer<typeof sessionSnapshotSchema>;

export class Session {
  #history: HistoryEntry[];
  #checkpoints: Checkpoint[] = [];
  #head: string | null = null;

  private constructor(
    readonly id: string,
    readonly projectId: string,
    readonly parentSessionId: string | null,
    history: HistoryEntry[],
  ) {
    this.#history = history;
  }

  static create(input: { projectId: string }): Session {
    const session = new Session(crypto.randomUUID(), input.projectId, null, []);
    session.checkpoint({ type: "idle" });
    return session;
  }

  get history(): readonly HistoryEntry[] {
    return this.#history;
  }

  get checkpoints(): readonly Checkpoint[] {
    return this.#checkpoints;
  }

  get head(): string | null {
    return this.#head;
  }

  checkpoint(state: MachineState): void {
    const checkpoint = checkpointSchema.parse(
      JSON.parse(
        JSON.stringify({
          id: crypto.randomUUID(),
          parentId: this.#head,
          sessionId: this.id,
          sequence: this.#checkpoints.length,
          state,
          history: this.#history,
        }),
      ),
    );
    this.#checkpoints.push(checkpoint);
    this.#head = checkpoint.id;
  }

  append(entry: HistoryEntry): void {
    this.#history.push(entry);
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
