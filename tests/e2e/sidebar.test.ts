import { expect, test } from "@playwright/test";
import { setTestConfig } from "./test-config";
import { sidebar } from "./wrappers";

test.beforeEach(async ({ request }) => {
  await setTestConfig(request);
});

test("app loads and shows the new session button", async ({ page }) => {
  await page.goto("/");
  await expect(sidebar(page).createButton).toHaveText("New session");
});

test("creating a session adds it to the sidebar and navigates to it", async ({
  page,
}) => {
  const bar = sidebar(page);
  await bar.createSession();
  await expect(bar.list.getByText("New session").first()).toBeVisible();
});
