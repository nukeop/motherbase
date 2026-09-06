import { SessionPermissions } from "./session-permissions";

type SessionLike = {
  id: string;
  directory: string | null;
};

export class PermissionsRegistry {
  readonly #sessions = new Map<string, SessionPermissions>();

  forSession(session: SessionLike): SessionPermissions {
    const existing = this.#sessions.get(session.id);
    if (existing) {
      return existing;
    }
    const created = new SessionPermissions(session.id, session.directory);
    this.#sessions.set(session.id, created);
    return created;
  }

  find(sessionId: string): SessionPermissions | undefined {
    return this.#sessions.get(sessionId);
  }
}
