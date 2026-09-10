import { expect, test } from "@playwright/test";
import { TestBackend } from "./test-backend";
import { setTestConfig } from "./test-config";
import { DEFAULT_TEST_PROVIDER } from "./test-provider";
import { composer, sidebar } from "./wrappers";

test.beforeEach(async ({ page, request }) => {
  await setTestConfig(request);
  await new TestBackend(request, DEFAULT_TEST_PROVIDER).scriptFailure(
    "Service unavailable",
  );
  await sidebar(page).createSession();
});

test("model error shows error message in conversation", async ({ page }) => {
  await composer(page).send("Hello");

  await expect(page.getByText("Hello")).toBeVisible();
  await expect(page.getByText("Service unavailable")).toBeVisible();
});
