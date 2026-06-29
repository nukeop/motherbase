import { expect, test } from "@playwright/test";
import { setTestConfig } from "./helpers";

test.beforeEach(async ({ request }) => {
  await setTestConfig(request);
});

test("app loads and shows the new session button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("create-session")).toBeVisible();
  await expect(page.getByTestId("create-session")).toHaveText("New session");
});

test("creating a session adds it to the sidebar and navigates to it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("create-session").click();
  await expect(page).toHaveURL(/\/sessions\/.+/);
  await expect(
    page.getByTestId("session-list").getByText("New session"),
  ).toBeVisible();
});
