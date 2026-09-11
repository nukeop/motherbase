import type {
  Claim,
  PermissionOutcome,
  PermissionReplied,
  PermissionRequest,
} from "@motherbase/core";
import { bus } from "../../events";
import { appendEntry } from "../../sessions/store";
import { ToolError } from "../tools/definition";
import { SessionGrants } from "./session-grants";

type Pending = {
  claim: Claim;
  resolvers: PromiseWithResolvers<void>;
};

export class SessionPermissions {
  readonly #grants: SessionGrants;
  readonly #pending = new Map<string, Pending>();

  constructor(
    private readonly sessionId: string,
    initialClaims: readonly Claim[],
  ) {
    this.#grants = new SessionGrants(initialClaims);
    bus.on(sessionId, "permission-replied", (replied) => this.settle(replied));
  }

  hasPending(requestId: string): boolean {
    return this.#pending.has(requestId);
  }

  async authorize(toolName: string, claim: Claim): Promise<void> {
    if (this.#grants.covers(claim)) {
      return;
    }
    const request: PermissionRequest = {
      id: crypto.randomUUID(),
      toolName,
      claim,
    };
    appendEntry(this.sessionId, { kind: "permission-request", request });

    const resolvers = Promise.withResolvers<void>();
    this.#pending.set(request.id, { claim, resolvers });
    bus.emit(this.sessionId, "permission-requested", { request });
    await resolvers.promise;
  }

  private settle({ requestId, reply }: PermissionReplied): void {
    const pending = this.#pending.get(requestId);
    if (!pending) {
      return;
    }

    const outcome = this.outcomeFor(pending, reply);
    appendEntry(this.sessionId, {
      kind: "permission-reply",
      requestId,
      outcome,
    });
    this.#pending.delete(requestId);
    if (outcome.decision === "always") {
      this.#grants.add(outcome.granted);
    }
    this.settlePromise(pending, outcome);
    bus.emit(this.sessionId, "permission-resolved", { requestId, outcome });
  }

  private outcomeFor(
    pending: Pending,
    reply: PermissionReplied["reply"],
  ): PermissionOutcome {
    if (reply.decision === "deny") {
      return { decision: "deny", granted: null };
    }
    if (reply.decision === "always") {
      const granted: Claim = { verb: pending.claim.verb, path: reply.prefix };
      return { decision: "always", granted };
    }
    return { decision: "once", granted: null };
  }

  private settlePromise(pending: Pending, outcome: PermissionOutcome): void {
    if (outcome.decision === "deny") {
      pending.resolvers.reject(
        new ToolError("The user denied access to this path"),
      );
      return;
    }
    pending.resolvers.resolve();
  }
}
