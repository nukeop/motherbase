import { expect, test } from "@playwright/test";
import {
  createSession,
  SERVER_URL,
  selectModel,
  selectProvider,
} from "./helpers";

const TEST_PROVIDER = {
  id: "error-provider",
  name: "Error Provider",
  models: [{ id: "error-model", name: "Error Model" }],
};

test.beforeEach(async ({ page, request }) => {
  await request.post(`${SERVER_URL}/_test/providers`, {
    data: { providers: [TEST_PROVIDER] },
  });
  await request.post(`${SERVER_URL}/_test/model`, {
    data: {
      provider: "error-provider",
      model: "error-model",
      chunks: [],
      error: "Service unavailable",
    },
  });
  await createSession(page);
});

test("model error shows error message in conversation", async ({ page }) => {
  await selectProvider(page, "Error Provider");
  await selectModel(page, "Error Model");

  await page.getByPlaceholder("Send a message...").fill("Hello");
  await page.keyboard.press("Enter");

  await expect(page.getByText("Hello")).toBeVisible();
  await expect(page.getByText("Service unavailable")).toBeVisible();
});
