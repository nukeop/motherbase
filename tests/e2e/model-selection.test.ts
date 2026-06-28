import { expect, test } from "@playwright/test";
import { createSession, SERVER_URL, selectProvider } from "./helpers";

const TEST_PROVIDER = {
  id: "selection-provider",
  name: "Selection Provider",
  models: [
    { id: "selection-model-alpha", name: "Selection Model Alpha" },
    { id: "selection-model-beta", name: "Selection Model Beta" },
  ],
};

test.beforeEach(async ({ page, request }) => {
  await request.post(`${SERVER_URL}/_test/providers`, {
    data: { providers: [TEST_PROVIDER] },
  });
  await createSession(page);
});

test("selecting a provider shows its models in the model dropdown", async ({
  page,
}) => {
  await selectProvider(page, "Selection Provider");

  await page.getByPlaceholder("Search models...").click();

  await expect(
    page.getByRole("option", { name: /Selection Model Alpha/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: /Selection Model Beta/ }),
  ).toBeVisible();
});

test("selecting a model updates the input value", async ({ page }) => {
  await selectProvider(page, "Selection Provider");

  await page.getByPlaceholder("Search models...").click();
  await page
    .getByRole("option", { name: /Selection Model Alpha/ })
    .click();

  await expect(page.getByPlaceholder("Search models...")).toHaveValue(
    "Selection Model Alpha",
  );
});
