import { expect, test } from "@playwright/test";

const TEST_PROVIDER = {
  id: "test-provider",
  name: "Test Provider",
  models: [
    { id: "test-model-1", name: "Test Model Alpha" },
    { id: "test-model-2", name: "Test Model Beta" },
  ],
};

test.beforeEach(async ({ request }) => {
  await request.post("http://localhost:4800/_test/providers", {
    data: { providers: [TEST_PROVIDER] },
  });
  await request.post("http://localhost:4800/state/provider", {
    data: { provider: "test-provider" },
  });
});

test("selecting a provider shows its name in the selector", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /new session/i }).click();

  await expect(page.getByText("Test Provider")).toBeVisible();
});

test("selecting a model from the dropdown updates the selector", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /new session/i }).click();

  const modelSearch = page.getByPlaceholder("Search models...");
  await modelSearch.click();
  await page.getByText("Test Model Alpha").click();

  await expect(modelSearch).toHaveValue("Test Model Alpha");
});
