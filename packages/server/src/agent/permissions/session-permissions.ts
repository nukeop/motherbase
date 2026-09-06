import type {
  Claim,
  PermissionOutcome,
  PermissionReply,
} from "@motherbase/core";
import { bus } from "../../events";
import { ToolError } from "../tools/definition";
import { SessionGrants } from "./session-grants";

type Pending = {
  claim: Claim;
  resolvers: PromiseWithResolvers<void>;
};

export class SessionPermissions {
  readonly #grants = new SessionGrants();
  readonly #pending = new Map<string, Pending>();

  constructor(
    private readonly sessionId: string,
    directory: string | null,
  ) {
    if (directory !== null) {
      this.#grants.add({ verb: "read", path: directory });
    }
  }

  async authorize(toolName: string, claim: Claim): Promise<void> {
    if (this.#grants.covers(claim)) {
      return;
    }
    const id = crypto.randomUUID();
    const resolvers = Promise.withResolvers<void>();
    this.#pending.set(id, { claim, resolvers });
    bus.emit(this.sessionId, {
      type: "permission-requested",
      request: { id, toolName, claim },
    });
    await resolvers.promise;
  }

  reply(requestId: string, reply: PermissionReply): PermissionOutcome | null {
    const pending = this.#pending.get(requestId);
    if (!pending) {
      return null;
    }
    this.#pending.delete(requestId);

    if (reply.decision === "deny") {
      pending.resolvers.reject(
        new ToolError("The user denied access to this path"),
      );
      return { decision: "deny", granted: null };
    }
    if (reply.decision === "always") {
      const granted: Claim = { verb: pending.claim.verb, path: reply.prefix };
      this.#grants.add(granted);
      pending.resolvers.resolve();
      return { decision: "always", granted };
    }
    pending.resolvers.resolve();
    return { decision: "once", granted: null };
  }
}
