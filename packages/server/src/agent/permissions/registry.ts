import { projectGrants } from "@motherbase/core";
import { getHistory } from "../../sessions/store";
import { sessionDirectoryGrants } from "./session-grants";
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
    const created = new SessionPermissions(session.id, [
      ...sessionDirectoryGrants(session.directory),
      ...projectGrants(getHistory(session.id)),
    ]);
    this.#sessions.set(session.id, created);
    return created;
  }

  find(sessionId: string): SessionPermissions | undefined {
    return this.#sessions.get(sessionId);
  }
}
