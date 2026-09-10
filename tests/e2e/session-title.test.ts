import { expect, test } from "@playwright/test";
import { TestBackend } from "./test-backend";
import { setTestConfig } from "./test-config";
import type { TestProvider } from "./test-provider";
import { composer, modelPicker, sidebar } from "./wrappers";

const TITLE_PROVIDER: TestProvider = {
  id: "title-provider",
  name: "Title Provider",
  models: [
    { id: "title-model", name: "Title Model" },
    { id: "cheap-model", name: "Cheap Model" },
  ],
};

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request, {
    provider: "title-provider",
    model: "title-model",
    cheap: { provider: "title-provider", model: "cheap-model" },
    generateTitles: true,
  });
  await new TestBackend(request, TITLE_PROVIDER).registerProvider();
  await sidebar(page).createSession();
  await modelPicker(page).selectProvider("Title Provider");
  await modelPicker(page).selectModel("Title Model");
});

test("sending a message generates and shows the session title", async ({
  page,
  request,
}) => {
  const backend = new TestBackend(request, TITLE_PROVIDER);
  await backend.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text: "Sure, here is the deploy pipeline." },
    { type: "finish", reason: "stop" },
  ]);
  await backend.scriptTurn(
    [
      { type: "text-start" },
      { type: "text-delta", text: "Deploy pipeline setup" },
      { type: "finish", reason: "stop" },
    ],
    "cheap-model",
  );

  await composer(page).send("How do I set up the deploy pipeline?");

  await expect(
    page.getByText("Sure, here is the deploy pipeline."),
  ).toBeVisible();
  await expect(
    sidebar(page).list.getByText("Deploy pipeline setup"),
  ).toBeVisible();
});
