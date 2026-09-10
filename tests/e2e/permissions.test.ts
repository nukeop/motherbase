import { expect, test } from "@playwright/test";
import { HistoryBuilder } from "./builders/HistoryBuilder";
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
  const firstTurn = new HistoryBuilder()
    .userMessage("Read the first file")
    .readCall("call-1", "/tmp/project/src/first.ts")
    .readRequested(requestId, "/tmp/project/src/first.ts")
    .allowedOnce(requestId)
    .readSucceeded("call-1")
    .assistantMessage("I read it once.");
  expect(await backend.history(currentSessionId(page))).toEqual(
    firstTurn.build(),
  );

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
  expect(await backend.history(currentSessionId(page))).toEqual(
    firstTurn
      .userMessage("Read it again")
      .readCall("call-2", "/tmp/project/src/first.ts")
      .readRequested(secondRequestId, "/tmp/project/src/first.ts")
      .build(),
  );
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
    "Allowed for this session · /tmp/project",
  );

  const requestId = await card.requestId();
  const firstTurn = new HistoryBuilder()
    .userMessage("Read the first file")
    .readCall("call-1", "/tmp/project/src/first.ts")
    .readRequested(requestId, "/tmp/project/src/first.ts")
    .allowedAlways(requestId, { verb: "read", path: "/tmp/project" })
    .readSucceeded("call-1")
    .assistantMessage("First file done.");
  expect(await backend.history(currentSessionId(page))).toEqual(
    firstTurn.build(),
  );

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

  expect(await backend.history(currentSessionId(page))).toEqual(
    firstTurn
      .userMessage("Now read the second file")
      .readCall("call-2", "/tmp/project/docs/second.md")
      .readSucceeded("call-2")
      .assistantMessage("Second file done.")
      .build(),
  );
});

test("Deny gives the model an error result and the conversation continues", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(
    backend,
    "call-1",
    "/tmp/project/src/first.ts",
    "Understood, I will not read it.",
  );
  await composer(page).send("Read the first file");

  const chat = conversation(page);
  const card = chat.permission();
  await card.deny();

  await expect(page.getByText("Understood, I will not read it.")).toBeVisible();
  await expect(card.decision).toHaveText("Denied");
  await expect(card.allowOnceButton).toHaveCount(0);
  await expect(chat.toolError().header).toHaveText("Tool error");
  await expect(chat.toolError().body).toHaveText(
    "The user denied access to this path",
  );
  await expect(chat.errorMessages).toHaveCount(0);

  const requestId = await card.requestId();
  expect(await backend.history(currentSessionId(page))).toEqual(
    new HistoryBuilder()
      .userMessage("Read the first file")
      .readCall("call-1", "/tmp/project/src/first.ts")
      .readRequested(requestId, "/tmp/project/src/first.ts")
      .denied(requestId)
      .readForbidden("call-1")
      .assistantMessage("Understood, I will not read it.")
      .build(),
  );
});

test("reload with a pending card keeps the same request and Allow once completes it", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(
    backend,
    "call-1",
    "/tmp/project/src/first.ts",
    "Read after reload.",
  );
  await composer(page).send("Read the first file");

  const chat = conversation(page);
  const card = chat.permission();
  await expect(card.allowOnceButton).toBeVisible();
  const requestId = await card.requestId();

  await page.reload();

  await expect(chat.permissions).toHaveCount(1);
  await expect(card.path).toHaveText("/tmp/project/src/first.ts");
  expect(await card.requestId()).toBe(requestId);

  await card.allowOnce();

  await expect(page.getByText("Read after reload.")).toBeVisible();
  await expect(card.decision).toHaveText("Allowed once");
  expect(await backend.history(currentSessionId(page))).toEqual(
    new HistoryBuilder()
      .userMessage("Read the first file")
      .readCall("call-1", "/tmp/project/src/first.ts")
      .readRequested(requestId, "/tmp/project/src/first.ts")
      .allowedOnce(requestId)
      .readSucceeded("call-1")
      .assistantMessage("Read after reload.")
      .build(),
  );
});

test("reload after a decision shows it read-only and adds no history", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(backend, "call-1", "/tmp/project/src/first.ts", "Done.");
  await composer(page).send("Read the first file");

  const chat = conversation(page);
  const card = chat.permission();
  await card.allowOnce();
  await expect(page.getByText("Done.")).toBeVisible();
  const requestId = await card.requestId();

  await page.reload();

  await expect(chat.permissions).toHaveCount(1);
  await expect(card.toolName).toHaveText("read");
  await expect(card.path).toHaveText("/tmp/project/src/first.ts");
  await expect(card.decision).toHaveText("Allowed once");
  await expect(card.allowOnceButton).toHaveCount(0);
  await expect(card.allowAlwaysButton).toHaveCount(0);
  await expect(card.denyButton).toHaveCount(0);
  expect(await backend.history(currentSessionId(page))).toEqual(
    new HistoryBuilder()
      .userMessage("Read the first file")
      .readCall("call-1", "/tmp/project/src/first.ts")
      .readRequested(requestId, "/tmp/project/src/first.ts")
      .allowedOnce(requestId)
      .readSucceeded("call-1")
      .assistantMessage("Done.")
      .build(),
  );
});

test("accepting in one tab shows the same decision in a second tab", async ({
  page,
  context,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(backend, "call-1", "/tmp/project/src/first.ts", "Done.");
  await composer(page).send("Read the first file");

  const firstCard = conversation(page).permission();
  await expect(firstCard.allowOnceButton).toBeVisible();

  const secondTab = await context.newPage();
  await secondTab.goto(page.url());
  const secondCard = conversation(secondTab).permission();
  await expect(secondCard.allowOnceButton).toBeVisible();

  await firstCard.allowOnce();

  await expect(firstCard.decision).toHaveText("Allowed once");
  await expect(secondCard.decision).toHaveText("Allowed once");
  await expect(secondCard.allowOnceButton).toHaveCount(0);
  await expect(secondTab.getByText("Done.")).toBeVisible();
});

test("a 409 reply shows the inactive error and no decision", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(backend, "call-1", "/tmp/project/src/first.ts", "Done.");
  await composer(page).send("Read the first file");

  await page.route("**/sessions/*/permissions/*", (route) =>
    route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({
        error: "This permission request is no longer active.",
      }),
    }),
  );

  const card = conversation(page).permission();
  await card.allowOnce();

  await expect(card.alert).toHaveText(
    "This permission request is no longer active.",
  );
  await expect(card.decision).toHaveCount(0);
  expect(await backend.history(currentSessionId(page))).toEqual(
    new HistoryBuilder()
      .userMessage("Read the first file")
      .readCall("call-1", "/tmp/project/src/first.ts")
      .readRequested(await card.requestId(), "/tmp/project/src/first.ts")
      .build(),
  );
});

test("a 500 reply keeps the card for retry and the retry completes", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(
    backend,
    "call-1",
    "/tmp/project/src/first.ts",
    "Read on retry.",
  );
  await composer(page).send("Read the first file");

  await page.route("**/sessions/*/permissions/*", (route) =>
    route.fulfill({ status: 500 }),
  );

  const card = conversation(page).permission();
  await card.allowOnce();

  await expect(card.alert).toHaveText("Request failed: 500");
  await expect(card.allowOnceButton).toBeEnabled();
  await expect(card.decision).toHaveCount(0);

  await page.unroute("**/sessions/*/permissions/*");
  await card.allowOnce();

  await expect(page.getByText("Read on retry.")).toBeVisible();
  await expect(card.alert).toHaveCount(0);
  await expect(card.decision).toHaveText("Allowed once");
  const requestId = await card.requestId();
  expect(await backend.history(currentSessionId(page))).toEqual(
    new HistoryBuilder()
      .userMessage("Read the first file")
      .readCall("call-1", "/tmp/project/src/first.ts")
      .readRequested(requestId, "/tmp/project/src/first.ts")
      .allowedOnce(requestId)
      .readSucceeded("call-1")
      .assistantMessage("Read on retry.")
      .build(),
  );
});

test("controls are disabled while a reply is in flight", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, DEFAULT_TEST_PROVIDER);
  await scriptRead(backend, "call-1", "/tmp/project/src/first.ts", "Done.");
  await composer(page).send("Read the first file");

  const held = Promise.withResolvers<void>();
  await page.route("**/sessions/*/permissions/*", async (route) => {
    await held.promise;
    await route.continue();
  });

  const card = conversation(page).permission();
  await card.allowOnce();

  await expect(card.allowOnceButton).toBeDisabled();
  await expect(card.allowAlwaysButton).toBeDisabled();
  await expect(card.denyButton).toBeDisabled();
  await expect(card.crumb("project")).toBeDisabled();
  await expect(card.crumb("first.ts")).toBeDisabled();

  held.resolve();

  await expect(page.getByText("Done.")).toBeVisible();
  await expect(card.decision).toHaveText("Allowed once");
});
