import type {
  Claim,
  PermissionOutcome,
  PermissionReplied,
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
    bus.on(sessionId, "permission-replied", (replied) => this.settle(replied));
  }

  async authorize(toolName: string, claim: Claim): Promise<void> {
    if (this.#grants.covers(claim)) {
      return;
    }
    const id = crypto.randomUUID();
    const resolvers = Promise.withResolvers<void>();
    this.#pending.set(id, { claim, resolvers });
    bus.emit(this.sessionId, "permission-requested", {
      request: { id, toolName, claim },
    });
    await resolvers.promise;
  }

  private settle({ requestId, reply }: PermissionReplied): void {
    const pending = this.#pending.get(requestId);
    if (!pending) {
      return;
    }
    this.#pending.delete(requestId);

    const outcome = this.resolve(pending, reply);
    bus.emit(this.sessionId, "permission-resolved", { requestId, outcome });
  }

  private resolve(
    pending: Pending,
    reply: PermissionReplied["reply"],
  ): PermissionOutcome {
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
