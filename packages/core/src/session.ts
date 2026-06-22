import type { HistoryEntry } from "./history";

export class Session {
  #history: HistoryEntry[];

  private constructor(
    readonly id: string,
    readonly projectId: string,
    readonly parentSessionId: string | null,
    history: HistoryEntry[],
    readonly createdAt: Date,
  ) {
    this.#history = history;
  }

  static create(input: { projectId: string }): Session {
    return new Session(crypto.randomUUID(), input.projectId, null, [], new Date());
  }

  get history(): readonly HistoryEntry[] {
    return this.#history;
  }

  append(entry: HistoryEntry): void {
    this.#history.push(entry);
  }
}
