import { expect, test } from "@playwright/test";
import { TestBackend } from "./test-backend";
import { setTestConfig } from "./test-config";
import { modelPicker, sidebar } from "./wrappers";

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request);
  await new TestBackend(request, {
    id: "selection-provider",
    name: "Selection Provider",
    models: [
      { id: "selection-model-alpha", name: "Selection Model Alpha" },
      { id: "selection-model-beta", name: "Selection Model Beta" },
    ],
  }).registerProvider();
  await sidebar(page).createSession();
});

test("selecting a provider shows its models in the model dropdown", async ({
  page,
}) => {
  const picker = modelPicker(page);
  await picker.selectProvider("Selection Provider");
  await picker.openModels();

  await expect(picker.option("Selection Model Alpha")).toBeVisible();
  await expect(picker.option("Selection Model Beta")).toBeVisible();
});

test("selecting a model updates the input value", async ({ page }) => {
  const picker = modelPicker(page);
  await picker.selectProvider("Selection Provider");
  await picker.selectModel("Selection Model Alpha");

  await expect(picker.modelInput).toHaveValue("Selection Model Alpha");
});
