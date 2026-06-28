import { expect, test } from "@playwright/test";

const TEST_PROVIDER = {
  id: "test-provider",
  name: "Test Provider",
  models: [{ id: "test-model", name: "Test Model" }],
};

const RESPONSE_CHUNKS = [
  { type: "text-delta", text: "Hello" },
  { type: "text-delta", text: " from" },
  { type: "text-delta", text: " Motherbase" },
  { type: "finish", reason: "stop" },
];

test.beforeEach(async ({ request }) => {
  await request.post("http://localhost:4800/_test/providers", {
    data: { providers: [TEST_PROVIDER] },
  });
  await request.post("http://localhost:4800/_test/model", {
    data: { provider: "test-provider", model: "test-model", chunks: RESPONSE_CHUNKS },
  });
  await request.post("http://localhost:4800/state/provider", {
    data: { provider: "test-provider" },
  });
  await request.post("http://localhost:4800/state/model", {
    data: { model: "test-model" },
  });
});

test("user sends a message and sees the streamed response", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /new session/i }).click();
  await expect(page).toHaveURL(/\/sessions\/.+/);

  await page.getByPlaceholder("Send a message...").fill("Hello Motherbase");
  await page.keyboard.press("Enter");

  await expect(page.getByText("Hello Motherbase")).toBeVisible();
  await expect(page.getByText("Hello from Motherbase")).toBeVisible();
});
