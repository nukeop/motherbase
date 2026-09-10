import { expect, test } from "@playwright/test";
import { TestBackend } from "./test-backend";
import { setTestConfig } from "./test-config";
import { DEFAULT_TEST_PROVIDER } from "./test-provider";
import { composer, currentSessionId, sidebar } from "./wrappers";

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request);
  await new TestBackend(request, DEFAULT_TEST_PROVIDER).scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Hello" },
    { type: "text-delta", text: " from" },
    { type: "text-delta", text: " Motherbase" },
    { type: "finish", reason: "stop" },
  ]);
  await sidebar(page).createSession();
});

test("user sends a message and sees the streamed response", async ({
  page,
}) => {
  await composer(page).send("Hello Motherbase");

  await expect(page.getByText("Hello Motherbase")).toBeVisible();
  await expect(page.getByText("Hello from Motherbase")).toBeVisible();
});

test("user deletes a session from the sidebar", async ({ page }) => {
  const session = sidebar(page).session(currentSessionId(page));

  await expect(session.root).toBeVisible();
  await session.deleteButton.click();

  await expect(session.root).not.toBeVisible();
  await expect(page).toHaveURL("/");
});
