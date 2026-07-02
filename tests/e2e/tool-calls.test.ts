import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from "@playwright/test";
import {
  createSession,
  registerTools,
  SERVER_URL,
  selectModel,
  selectProvider,
  setTestConfig,
} from "./helpers";

const TEST_PROVIDER = {
  id: "tool-provider",
  name: "Tool Provider",
  models: [{ id: "tool-model", name: "Tool Model" }],
};

const scriptResponse = async (
  request: APIRequestContext,
  chunks: unknown[],
) => {
  await request.post(`${SERVER_URL}/_test/model`, {
    data: {
      provider: TEST_PROVIDER.id,
      model: TEST_PROVIDER.models[0]!.id,
      chunks,
    },
  });
};

const sendMessage = async (page: Page, text: string) => {
  const input = page.getByPlaceholder("Send a message...");
  await input.fill(text);
  await input.press("Enter");
};

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request);
  await request.post(`${SERVER_URL}/_test/providers`, {
    data: { providers: [TEST_PROVIDER] },
  });
  await createSession(page);
  await selectProvider(page, "Tool Provider");
  await selectModel(page, "Tool Model");
});

test("tool call round trip renders call, result, and continuation", async ({
  page,
  request,
}) => {
  await registerTools(request, [
    {
      name: "echo",
      description: "Echoes its input",
      behavior: "success",
      output: { echoed: "ping" },
    },
  ]);
  await scriptResponse(request, [
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
  await scriptResponse(request, [
    { type: "text-start" },
    { type: "text-delta", text: "The echo came back." },
    { type: "finish", reason: "stop" },
  ]);

  await sendMessage(page, "Ping the echo tool");

  await expect(page.getByText("The echo came back.")).toBeVisible();
  await expect(page.getByText("Let me check.")).toBeVisible();

  const call = page.getByTestId("tool-call");
  await expect(call).toContainText("Tool call · echo");
  await expect(call.locator("pre")).toHaveText(
    JSON.stringify({ value: "ping" }, null, 2),
  );

  const result = page.getByTestId("tool-result");
  await expect(result).toContainText("Tool result · echo · success");
  await expect(result.locator("pre")).toHaveText(
    JSON.stringify({ echoed: "ping" }, null, 2),
  );
});

test("tool error becomes a result and the conversation continues", async ({
  page,
  request,
}) => {
  await registerTools(request, [
    {
      name: "flaky",
      description: "Always fails on purpose",
      behavior: "tool-error",
      message: "file not found",
    },
  ]);
  await scriptResponse(request, [
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
  await scriptResponse(request, [
    { type: "text-start" },
    { type: "text-delta", text: "The file was missing." },
    { type: "finish", reason: "stop" },
  ]);

  await sendMessage(page, "Use the flaky tool");

  await expect(page.getByText("The file was missing.")).toBeVisible();

  const result = page.getByTestId("tool-result");
  await expect(result).toContainText("Tool result · flaky · error");
  await expect(result.locator("pre")).toHaveText('"file not found"');

  await expect(page.getByTestId("error-message")).toHaveCount(0);
});

test("tool crash becomes a result and the conversation continues", async ({
  page,
  request,
}) => {
  await registerTools(request, [
    {
      name: "buggy",
      description: "Throws an unexpected error",
      behavior: "crash",
      message: "unexpected explosion",
    },
  ]);
  await scriptResponse(request, [
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
  await scriptResponse(request, [
    { type: "text-start" },
    { type: "text-delta", text: "Something went wrong inside the tool." },
    { type: "finish", reason: "stop" },
  ]);

  await sendMessage(page, "Use the buggy tool");

  await expect(
    page.getByText("Something went wrong inside the tool."),
  ).toBeVisible();

  const result = page.getByTestId("tool-result");
  await expect(result).toContainText("Tool result · buggy · crash");
  await expect(result.locator("pre")).toHaveText('"unexpected explosion"');

  await expect(page.getByTestId("error-message")).toHaveCount(0);
});

test("unknown tool name produces an error result", async ({
  page,
  request,
}) => {
  await scriptResponse(request, [
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
  await scriptResponse(request, [
    { type: "text-start" },
    { type: "text-delta", text: "That tool does not exist." },
    { type: "finish", reason: "stop" },
  ]);

  await sendMessage(page, "Engage the warp drive");

  await expect(page.getByText("That tool does not exist.")).toBeVisible();

  const result = page.getByTestId("tool-result");
  await expect(result).toContainText("Tool result · warp-drive · error");
  await expect(result.locator("pre")).toHaveText('"No such tool: warp-drive"');

  await expect(page.getByTestId("error-message")).toHaveCount(0);
});

test("multiple tool calls in one message render in order", async ({
  page,
  request,
}) => {
  await registerTools(request, [
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
  await scriptResponse(request, [
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
  await scriptResponse(request, [
    { type: "text-start" },
    { type: "text-delta", text: "Both tools are done." },
    { type: "finish", reason: "stop" },
  ]);

  await sendMessage(page, "Run alpha and beta");

  await expect(page.getByText("Both tools are done.")).toBeVisible();

  const calls = page.getByTestId("tool-call");
  await expect(calls).toHaveCount(2);
  await expect(calls.nth(0)).toContainText("Tool call · alpha");
  await expect(calls.nth(1)).toContainText("Tool call · beta");

  const results = page.getByTestId("tool-result");
  await expect(results).toHaveCount(2);
  await expect(results.nth(0)).toContainText("Tool result · alpha · success");
  await expect(results.nth(0).locator("pre")).toHaveText('"alpha output"');
  await expect(results.nth(1)).toContainText("Tool result · beta · success");
  await expect(results.nth(1).locator("pre")).toHaveText('"beta output"');

  await expect(page.getByTestId("error-message")).toHaveCount(0);
});
