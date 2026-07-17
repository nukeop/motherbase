import { expect, test } from "@playwright/test";
import {
  createSession,
  SERVER_URL,
  selectModel,
  selectProvider,
  setTestConfig,
} from "./helpers";

const TEST_PROVIDER = {
  id: "title-provider",
  name: "Title Provider",
  models: [
    { id: "title-model", name: "Title Model" },
    { id: "cheap-model", name: "Cheap Model" },
  ],
};

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request, {
    provider: TEST_PROVIDER.id,
    model: "title-model",
    cheap: { provider: TEST_PROVIDER.id, model: "cheap-model" },
    generateTitles: true,
  });
  await request.post(`${SERVER_URL}/_test/providers`, {
    data: { providers: [TEST_PROVIDER] },
  });
  await createSession(page);
  await selectProvider(page, "Title Provider");
  await selectModel(page, "Title Model");
});

test("sending a message generates and shows the session title", async ({
  page,
  request,
}) => {
  await request.post(`${SERVER_URL}/_test/model`, {
    data: {
      provider: TEST_PROVIDER.id,
      model: "title-model",
      chunks: [
        { type: "text-start" },
        { type: "text-delta", text: "Sure, here is the deploy pipeline." },
        { type: "finish", reason: "stop" },
      ],
    },
  });
  await request.post(`${SERVER_URL}/_test/model`, {
    data: {
      provider: TEST_PROVIDER.id,
      model: "cheap-model",
      chunks: [
        { type: "text-start" },
        { type: "text-delta", text: "Deploy pipeline setup" },
        { type: "finish", reason: "stop" },
      ],
    },
  });

  await page
    .getByPlaceholder("Send a message...")
    .fill("How do I set up the deploy pipeline?");
  await page.keyboard.press("Enter");

  await expect(
    page.getByText("Sure, here is the deploy pipeline."),
  ).toBeVisible();
  await expect(
    page.getByTestId("session-list").getByText("Deploy pipeline setup"),
  ).toBeVisible();
});
