import { describe, expect, test } from "bun:test";
import type {
  MessageEntry,
  MessagePart,
  PermissionReplyEntry,
  PermissionRequestEntry,
  ToolResultEntry,
} from "@motherbase/core";
import { bus } from "../../src/events";
import { claimedReadTool, claimedWriteTool } from "../fixtures/tools";
import { Scenario } from "../harness/scenario";
import { scriptTextReply, scriptToolCallTurn } from "../utils/scripting";

describe("permissions in the agent loop", () => {
  test("approving a request runs the tool", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();
    scenario.withTools([claimedReadTool]);

    scriptToolCallTurn(
      scenario,
      [
        {
          toolCallId: "call-1",
          toolName: "read",
          input: { path: "/tmp/project/a.txt" },
        },
      ],
      "Checking",
    );
    scriptTextReply(scenario, "All done");

    const send = scenario.sendMessage("Read the file");
    const { request } = await scenario.waitFor("permission-requested");

    const requestEntry: PermissionRequestEntry = {
      kind: "permission-request",
      request,
    };
    expect(scenario.messages.at(-1)).toEqual(requestEntry);

    const resolved = scenario.waitFor("permission-resolved");
    bus.emit(scenario.session.id, "permission-replied", {
      requestId: request.id,
      reply: { decision: "once" },
    });
    await resolved;

    const replyEntry: PermissionReplyEntry = {
      kind: "permission-reply",
      requestId: request.id,
      outcome: { decision: "once", granted: null },
    };
    expect(scenario.messages.at(-1)).toEqual(replyEntry);

    await send;

    const toolCallPart: MessagePart = {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "read",
      input: { path: "/tmp/project/a.txt" },
    };
    const firstReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Checking" }, toolCallPart],
    };
    const toolResult: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "read",
      output: { read: "/tmp/project/a.txt" },
      outcome: "success",
    };
    const secondReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "All done" }],
    };

    expect(scenario.messages).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Read the file" }],
      },
      firstReply,
      requestEntry,
      replyEntry,
      toolResult,
      secondReply,
    ]);
  });

  test("denying a request forbids running the tool", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();
    scenario.withTools([claimedReadTool]);

    scriptToolCallTurn(
      scenario,
      [
        {
          toolCallId: "call-1",
          toolName: "read",
          input: { path: "/tmp/project/b.txt" },
        },
      ],
      "Checking",
    );
    scriptTextReply(scenario, "Understood");

    const send = scenario.sendMessage("Read the other file");
    const { request } = await scenario.waitFor("permission-requested");

    const resolved = scenario.waitFor("permission-resolved");
    bus.emit(scenario.session.id, "permission-replied", {
      requestId: request.id,
      reply: { decision: "deny" },
    });
    await resolved;
    await send;

    const toolCallPart: MessagePart = {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "read",
      input: { path: "/tmp/project/b.txt" },
    };
    const firstReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Checking" }, toolCallPart],
    };
    const requestEntry: PermissionRequestEntry = {
      kind: "permission-request",
      request,
    };
    const replyEntry: PermissionReplyEntry = {
      kind: "permission-reply",
      requestId: request.id,
      outcome: { decision: "deny", granted: null },
    };
    const toolResult: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "read",
      output: "The user denied access to this path",
      outcome: "error",
    };
    const secondReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Understood" }],
    };

    expect(scenario.messages).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Read the other file" }],
      },
      firstReply,
      requestEntry,
      replyEntry,
      toolResult,
      secondReply,
    ]);
  });

  test("approving a broader path than requested later reads under that path without asking", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();
    scenario.withTools([claimedReadTool]);

    scriptToolCallTurn(
      scenario,
      [
        {
          toolCallId: "call-1",
          toolName: "read",
          input: { path: "/tmp/project/src/a.txt" },
        },
      ],
      "Checking",
    );
    scriptTextReply(scenario, "First file read");

    const firstSend = scenario.sendMessage("Read the source file");
    const { request } = await scenario.waitFor("permission-requested");

    bus.emit(scenario.session.id, "permission-replied", {
      requestId: request.id,
      reply: { decision: "always", prefix: "/tmp/project" },
    });
    await firstSend;

    scriptToolCallTurn(
      scenario,
      [
        {
          toolCallId: "call-2",
          toolName: "read",
          input: { path: "/tmp/project/docs/b.txt" },
        },
      ],
      "Checking again",
    );
    scriptTextReply(scenario, "Second file read");

    await scenario.sendMessage("Read the docs file");

    const firstToolCallPart: MessagePart = {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "read",
      input: { path: "/tmp/project/src/a.txt" },
    };
    const firstReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Checking" }, firstToolCallPart],
    };
    const requestEntry: PermissionRequestEntry = {
      kind: "permission-request",
      request,
    };
    const replyEntry: PermissionReplyEntry = {
      kind: "permission-reply",
      requestId: request.id,
      outcome: {
        decision: "always",
        granted: { verb: "read", path: "/tmp/project" },
      },
    };
    const firstToolResult: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "read",
      output: { read: "/tmp/project/src/a.txt" },
      outcome: "success",
    };
    const firstFollowUp: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "First file read" }],
    };

    const secondToolCallPart: MessagePart = {
      type: "tool-call",
      toolCallId: "call-2",
      toolName: "read",
      input: { path: "/tmp/project/docs/b.txt" },
    };
    const secondReply: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Checking again" }, secondToolCallPart],
    };
    const secondToolResult: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-2",
      toolName: "read",
      output: { read: "/tmp/project/docs/b.txt" },
      outcome: "success",
    };
    const secondFollowUp: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Second file read" }],
    };

    expect(scenario.messages).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Read the source file" }],
      },
      firstReply,
      requestEntry,
      replyEntry,
      firstToolResult,
      firstFollowUp,
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Read the docs file" }],
      },
      secondReply,
      secondToolResult,
      secondFollowUp,
    ]);

    expect(
      scenario.messages.filter((entry) => entry.kind === "permission-request"),
    ).toEqual([requestEntry]);
    expect(
      scenario.messages.filter((entry) => entry.kind === "permission-reply"),
    ).toEqual([replyEntry]);
  });

  test("reopening a session keeps an earlier always approval", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();
    scenario.withTools([claimedReadTool]);

    scriptToolCallTurn(scenario, [
      {
        toolCallId: "call-1",
        toolName: "read",
        input: { path: "/tmp/project/a.txt" },
      },
    ]);
    scriptTextReply(scenario, "Read done");

    const firstSend = scenario.sendMessage("Read the file");
    const { request } = await scenario.waitFor("permission-requested");
    bus.emit(scenario.session.id, "permission-replied", {
      requestId: request.id,
      reply: { decision: "always", prefix: "/tmp/project" },
    });
    await firstSend;

    scenario.withPermissions();

    scriptToolCallTurn(scenario, [
      {
        toolCallId: "call-2",
        toolName: "read",
        input: { path: "/tmp/project/b.txt" },
      },
    ]);
    scriptTextReply(scenario, "Read again");

    await scenario.sendMessage("Read the other file");

    expect(scenario.messages.slice(-3)).toEqual([
      {
        kind: "message",
        role: "assistant",
        parts: [
          {
            type: "tool-call",
            toolCallId: "call-2",
            toolName: "read",
            input: { path: "/tmp/project/b.txt" },
          },
        ],
      },
      {
        kind: "tool-result",
        toolCallId: "call-2",
        toolName: "read",
        output: { read: "/tmp/project/b.txt" },
        outcome: "success",
      },
      {
        kind: "message",
        role: "assistant",
        parts: [{ type: "text", text: "Read again" }],
      },
    ]);
  });

  test("the session directory is writable without asking", async () => {
    const scenario = new Scenario();
    scenario.withPermissions("/tmp/project");
    scenario.withTools([claimedWriteTool]);

    scriptToolCallTurn(scenario, [
      {
        toolCallId: "call-1",
        toolName: "write",
        input: { path: "/tmp/project/out.txt" },
      },
    ]);
    scriptTextReply(scenario, "Written");

    await scenario.sendMessage("Write the file");

    expect(scenario.messages).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Write the file" }],
      },
      {
        kind: "message",
        role: "assistant",
        parts: [
          {
            type: "tool-call",
            toolCallId: "call-1",
            toolName: "write",
            input: { path: "/tmp/project/out.txt" },
          },
        ],
      },
      {
        kind: "tool-result",
        toolCallId: "call-1",
        toolName: "write",
        output: { wrote: "/tmp/project/out.txt" },
        outcome: "success",
      },
      {
        kind: "message",
        role: "assistant",
        parts: [{ type: "text", text: "Written" }],
      },
    ]);
  });

  test("a read approval does not cover a write to the same path", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();
    scenario.withTools([claimedReadTool, claimedWriteTool]);

    scriptToolCallTurn(scenario, [
      {
        toolCallId: "call-1",
        toolName: "read",
        input: { path: "/tmp/project/a.txt" },
      },
    ]);
    scriptTextReply(scenario, "Read done");

    const firstSend = scenario.sendMessage("Read the file");
    const readRequested = await scenario.waitFor("permission-requested");
    bus.emit(scenario.session.id, "permission-replied", {
      requestId: readRequested.request.id,
      reply: { decision: "always", prefix: "/tmp/project" },
    });
    await firstSend;

    scriptToolCallTurn(scenario, [
      {
        toolCallId: "call-2",
        toolName: "write",
        input: { path: "/tmp/project/a.txt" },
      },
    ]);
    scriptTextReply(scenario, "Write done");

    const secondSend = scenario.sendMessage("Now write to it");
    const writeRequested = await scenario.waitFor("permission-requested");
    bus.emit(scenario.session.id, "permission-replied", {
      requestId: writeRequested.request.id,
      reply: { decision: "always", prefix: "/tmp/project" },
    });
    await secondSend;

    expect(writeRequested.request).toEqual({
      id: writeRequested.request.id,
      toolName: "write",
      claim: { verb: "write", path: "/tmp/project/a.txt" },
    });

    const writeRequestEntry: PermissionRequestEntry = {
      kind: "permission-request",
      request: writeRequested.request,
    };
    const writeReplyEntry: PermissionReplyEntry = {
      kind: "permission-reply",
      requestId: writeRequested.request.id,
      outcome: {
        decision: "always",
        granted: { verb: "write", path: "/tmp/project" },
      },
    };
    const writeResult: ToolResultEntry = {
      kind: "tool-result",
      toolCallId: "call-2",
      toolName: "write",
      output: { wrote: "/tmp/project/a.txt" },
      outcome: "success",
    };

    expect(scenario.messages.slice(-5)).toEqual([
      {
        kind: "message",
        role: "assistant",
        parts: [
          {
            type: "tool-call",
            toolCallId: "call-2",
            toolName: "write",
            input: { path: "/tmp/project/a.txt" },
          },
        ],
      },
      writeRequestEntry,
      writeReplyEntry,
      writeResult,
      {
        kind: "message",
        role: "assistant",
        parts: [{ type: "text", text: "Write done" }],
      },
    ]);
  });
});
