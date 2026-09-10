import { expect, test } from "@playwright/test";
import type { HistoryEntry } from "../../packages/core/src/history";
import { TestBackend } from "./test-backend";
import { setTestConfig } from "./test-config";
import { DEFAULT_TEST_PROVIDER } from "./test-provider";
import { composer, conversation, currentSessionId, sidebar } from "./wrappers";

const scriptRead = async (
  backend: TestBackend,
  toolCallId: string,
  path: string,
  continuation: string,
) => {
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Reading the file." },
    { type: "tool-call", toolCallId, toolName: "read", input: { path } },
    { type: "finish", reason: "tool-calls" },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: continuation },
    { type: "finish", reason: "stop" },
  ]);
};

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request);
  await new TestBackend(request, DEFAULT_TEST_PROVIDER).registerTools([
    {
      name: "read",
      description: "Reads a path after asking for permission",
      behavior: "success",
      output: "file contents",
      claim: "read",
    },
  ]);
  await sidebar(page).createSession();
});

test("Allow once runs the read and a second read of the same file asks again", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(
    backend,
    "call-1",
    "/tmp/project/src/first.ts",
    "I read it once.",
  );
  await composer(page).send("Read the first file");

  const chat = conversation(page);
  const card = chat.permission();
  await expect(card.toolName).toHaveText("read");
  await expect(card.path).toHaveText("/tmp/project/src/first.ts");

  await card.allowOnce();

  await expect(page.getByText("I read it once.")).toBeVisible();
  await expect(card.decision).toHaveText("Allowed once");
  await expect(chat.toolResult().header).toHaveText(
    "Tool result · read · success",
  );
  await expect(chat.toolResult().body).toHaveText('"file contents"');

  const requestId = await card.requestId();
  const firstTurn: HistoryEntry[] = [
    {
      kind: "message",
      role: "user",
      parts: [{ type: "text", text: "Read the first file" }],
    },
    {
      kind: "message",
      role: "assistant",
      parts: [
        { type: "text", text: "Reading the file." },
        {
          type: "tool-call",
          toolCallId: "call-1",
          toolName: "read",
          input: { path: "/tmp/project/src/first.ts" },
        },
      ],
    },
    {
      kind: "permission-request",
      request: {
        id: requestId,
        toolName: "read",
        claim: { verb: "read", path: "/tmp/project/src/first.ts" },
      },
    },
    {
      kind: "permission-reply",
      requestId,
      outcome: { decision: "once", granted: null },
    },
    {
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "read",
      output: "file contents",
      outcome: "success",
    },
    {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "I read it once." }],
    },
  ];
  expect(await backend.history(currentSessionId(page))).toEqual(firstTurn);

  await scriptRead(
    backend,
    "call-2",
    "/tmp/project/src/first.ts",
    "I read it again.",
  );
  await composer(page).send("Read it again");

  await expect(chat.permissions).toHaveCount(2);
  const secondCard = chat.permission(1);
  await expect(secondCard.path).toHaveText("/tmp/project/src/first.ts");
  await expect(secondCard.allowOnceButton).toBeVisible();

  const secondRequestId = await secondCard.requestId();
  expect(secondRequestId).not.toBe(requestId);
  expect(await backend.history(currentSessionId(page))).toEqual([
    ...firstTurn,
    {
      kind: "message",
      role: "user",
      parts: [{ type: "text", text: "Read it again" }],
    },
    {
      kind: "message",
      role: "assistant",
      parts: [
        { type: "text", text: "Reading the file." },
        {
          type: "tool-call",
          toolCallId: "call-2",
          toolName: "read",
          input: { path: "/tmp/project/src/first.ts" },
        },
      ],
    },
    {
      kind: "permission-request",
      request: {
        id: secondRequestId,
        toolName: "read",
        claim: { verb: "read", path: "/tmp/project/src/first.ts" },
      },
    },
  ]);
});

test("Allow always on the project breadcrumb covers a file in another folder", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(
    backend,
    "call-1",
    "/tmp/project/src/first.ts",
    "First file done.",
  );
  await composer(page).send("Read the first file");

  const chat = conversation(page);
  const card = chat.permission();
  await card.allowAlways("project");

  await expect(page.getByText("First file done.")).toBeVisible();
  await expect(card.decision).toHaveText(
    `Allowed for this session · /tmp/project`,
  );

  const requestId = await card.requestId();
  const firstTurn: HistoryEntry[] = [
    {
      kind: "message",
      role: "user",
      parts: [{ type: "text", text: "Read the first file" }],
    },
    {
      kind: "message",
      role: "assistant",
      parts: [
        { type: "text", text: "Reading the file." },
        {
          type: "tool-call",
          toolCallId: "call-1",
          toolName: "read",
          input: { path: "/tmp/project/src/first.ts" },
        },
      ],
    },
    {
      kind: "permission-request",
      request: {
        id: requestId,
        toolName: "read",
        claim: { verb: "read", path: "/tmp/project/src/first.ts" },
      },
    },
    {
      kind: "permission-reply",
      requestId,
      outcome: {
        decision: "always",
        granted: { verb: "read", path: "/tmp/project" },
      },
    },
    {
      kind: "tool-result",
      toolCallId: "call-1",
      toolName: "read",
      output: "file contents",
      outcome: "success",
    },
    {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "First file done." }],
    },
  ];
  expect(await backend.history(currentSessionId(page))).toEqual(firstTurn);

  await scriptRead(
    backend,
    "call-2",
    "/tmp/project/docs/second.md",
    "Second file done.",
  );
  await composer(page).send("Now read the second file");

  await expect(page.getByText("Second file done.")).toBeVisible();
  await expect(chat.permissions).toHaveCount(1);
  await expect(chat.toolResults).toHaveCount(2);

  expect(await backend.history(currentSessionId(page))).toEqual([
    ...firstTurn,
    {
      kind: "message",
      role: "user",
      parts: [{ type: "text", text: "Now read the second file" }],
    },
    {
      kind: "message",
      role: "assistant",
      parts: [
        { type: "text", text: "Reading the file." },
        {
          type: "tool-call",
          toolCallId: "call-2",
          toolName: "read",
          input: { path: "/tmp/project/docs/second.md" },
        },
      ],
    },
    {
      kind: "tool-result",
      toolCallId: "call-2",
      toolName: "read",
      output: "file contents",
      outcome: "success",
    },
    {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Second file done." }],
    },
  ]);
});
