import type { HistoryEntry } from "../../../packages/core/src/history";
import type {
  Claim,
  PermissionOutcome,
} from "../../../packages/core/src/permission";

export class HistoryBuilder {
  private entries: HistoryEntry[] = [];

  userMessage(text: string): this {
    this.entries.push({
      kind: "message",
      role: "user",
      parts: [{ type: "text", text }],
    });
    return this;
  }

  assistantMessage(text: string): this {
    this.entries.push({
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text }],
    });
    return this;
  }

  readCall(toolCallId: string, path: string): this {
    this.entries.push({
      kind: "message",
      role: "assistant",
      parts: [
        { type: "text", text: "Reading the file." },
        { type: "tool-call", toolCallId, toolName: "read", input: { path } },
      ],
    });
    return this;
  }

  readRequested(requestId: string, path: string): this {
    this.entries.push({
      kind: "permission-request",
      request: {
        id: requestId,
        toolName: "read",
        claim: { verb: "read", path },
      },
    });
    return this;
  }

  allowedOnce(requestId: string): this {
    return this.replied(requestId, { decision: "once", granted: null });
  }

  allowedAlways(requestId: string, granted: Claim): this {
    return this.replied(requestId, { decision: "always", granted });
  }

  denied(requestId: string): this {
    return this.replied(requestId, { decision: "deny", granted: null });
  }

  readSucceeded(toolCallId: string): this {
    this.entries.push({
      kind: "tool-result",
      toolCallId,
      toolName: "read",
      output: "file contents",
      outcome: "success",
    });
    return this;
  }

  readForbidden(toolCallId: string): this {
    this.entries.push({
      kind: "tool-result",
      toolCallId,
      toolName: "read",
      output: "The user denied access to this path",
      outcome: "error",
    });
    return this;
  }

  build(): HistoryEntry[] {
    return [...this.entries];
  }

  private replied(requestId: string, outcome: PermissionOutcome): this {
    this.entries.push({ kind: "permission-reply", requestId, outcome });
    return this;
  }
}
