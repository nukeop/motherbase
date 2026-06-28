import { expect, test } from "@playwright/test";
import {
  createSession,
  SERVER_URL,
  selectModel,
  selectProvider,
} from "./helpers";

const TEST_PROVIDER = {
  id: "lifecycle-provider",
  name: "Lifecycle Provider",
  models: [{ id: "lifecycle-model", name: "Lifecycle Model" }],
};

const RESPONSE_CHUNKS = [
  { type: "text-delta", text: "Hello" },
  { type: "text-delta", text: " from" },
  { type: "text-delta", text: " Motherbase" },
  { type: "finish", reason: "stop" },
];

test.beforeEach(async ({ page, request }) => {
  await request.post(`${SERVER_URL}/_test/providers`, {
    data: { providers: [TEST_PROVIDER] },
  });
  await request.post(`${SERVER_URL}/_test/model`, {
    data: {
      provider: "lifecycle-provider",
      model: "lifecycle-model",
      chunks: RESPONSE_CHUNKS,
    },
  });
  await createSession(page);
});

test("user sends a message and sees the streamed response", async ({
  page,
}) => {
  await selectProvider(page, "Lifecycle Provider");
  await selectModel(page, "Lifecycle Model");

  await page.getByPlaceholder("Send a message...").fill("Hello Motherbase");
  await page.keyboard.press("Enter");

  await expect(page.getByText("Hello Motherbase")).toBeVisible();
  await expect(page.getByText("Hello from Motherbase")).toBeVisible();
});
