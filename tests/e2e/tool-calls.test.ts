import { expect, test } from "@playwright/test";
import { TestBackend } from "./test-backend";
import { setTestConfig } from "./test-config";
import { DEFAULT_TEST_PROVIDER } from "./test-provider";
import { composer, conversation, sidebar } from "./wrappers";

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request);
  await sidebar(page).createSession();
});

test("tool call round trip renders call, result, and continuation", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await backend.registerTools([
    {
      name: "echo",
      description: "Echoes its input",
      behavior: "success",
      output: { echoed: "ping" },
    },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Let me check." },
    {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "echo",
      input: { value: "ping" },
    },
    { type: "finish", reason: "tool-calls" },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "The echo came back." },
    { type: "finish", reason: "stop" },
  ]);

  await composer(page).send("Ping the echo tool");

  await expect(page.getByText("The echo came back.")).toBeVisible();
  await expect(page.getByText("Let me check.")).toBeVisible();

  const chat = conversation(page);
  const call = chat.toolCall();
  await expect(call.header).toHaveText("Tool call · echo");
  await expect(call.body).toHaveText(
    JSON.stringify({ value: "ping" }, null, 2),
  );

  const result = chat.toolResult();
  await expect(result.header).toHaveText("Tool result · echo · success");
  await expect(result.body).toHaveText(
    JSON.stringify({ echoed: "ping" }, null, 2),
  );
});

test("tool error becomes a result and the conversation continues", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await backend.registerTools([
    {
      name: "flaky",
      description: "Always fails on purpose",
      behavior: "tool-error",
      message: "file not found",
    },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Trying the flaky tool." },
    {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "flaky",
      input: {},
    },
    { type: "finish", reason: "tool-calls" },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "The file was missing." },
    { type: "finish", reason: "stop" },
  ]);

  await composer(page).send("Use the flaky tool");

  await expect(page.getByText("The file was missing.")).toBeVisible();

  const chat = conversation(page);
  const error = chat.toolError();
  await expect(error.header).toHaveText("Tool error");
  await expect(error.body).toHaveText("file not found");

  await expect(chat.errorMessages).toHaveCount(0);
});

test("tool crash becomes a result and the conversation continues", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await backend.registerTools([
    {
      name: "buggy",
      description: "Throws an unexpected error",
      behavior: "crash",
      message: "unexpected explosion",
    },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Trying the buggy tool." },
    {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "buggy",
      input: {},
    },
    { type: "finish", reason: "tool-calls" },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Something went wrong inside the tool." },
    { type: "finish", reason: "stop" },
  ]);

  await composer(page).send("Use the buggy tool");

  await expect(
    page.getByText("Something went wrong inside the tool."),
  ).toBeVisible();

  const chat = conversation(page);
  const error = chat.toolError();
  await expect(error.header).toHaveText("Tool crashed");
  await expect(error.body).toHaveText("unexpected explosion");

  await expect(chat.errorMessages).toHaveCount(0);
});

test("unknown tool name produces an error result", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Engaging the warp drive." },
    {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "warp-drive",
      input: {},
    },
    { type: "finish", reason: "tool-calls" },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "That tool does not exist." },
    { type: "finish", reason: "stop" },
  ]);

  await composer(page).send("Engage the warp drive");

  await expect(page.getByText("That tool does not exist.")).toBeVisible();

  const chat = conversation(page);
  const error = chat.toolError();
  await expect(error.header).toHaveText("Tool error");
  await expect(error.body).toHaveText("No such tool: warp-drive");

  await expect(chat.errorMessages).toHaveCount(0);
});

test("multiple tool calls in one message render in order", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await backend.registerTools([
    {
      name: "alpha",
      description: "First tool",
      behavior: "success",
      output: "alpha output",
    },
    {
      name: "beta",
      description: "Second tool",
      behavior: "success",
      output: "beta output",
    },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Running both tools." },
    {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "alpha",
      input: {},
    },
    {
      type: "tool-call",
      toolCallId: "call-2",
      toolName: "beta",
      input: {},
    },
    { type: "finish", reason: "tool-calls" },
  ]);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Both tools are done." },
    { type: "finish", reason: "stop" },
  ]);

  await composer(page).send("Run alpha and beta");

  await expect(page.getByText("Both tools are done.")).toBeVisible();

  const chat = conversation(page);
  await expect(chat.toolCalls).toHaveCount(2);
  await expect(chat.toolCall(0).header).toHaveText("Tool call · alpha");
  await expect(chat.toolCall(1).header).toHaveText("Tool call · beta");

  await expect(chat.toolResults).toHaveCount(2);
  await expect(chat.toolResult(0).header).toHaveText(
    "Tool result · alpha · success",
  );
  await expect(chat.toolResult(0).body).toHaveText('"alpha output"');
  await expect(chat.toolResult(1).header).toHaveText(
    "Tool result · beta · success",
  );
  await expect(chat.toolResult(1).body).toHaveText('"beta output"');

  await expect(chat.errorMessages).toHaveCount(0);
});
