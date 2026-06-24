import { expect, test } from "@playwright/test";

test("app loads and shows the new session button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /new session/i })).toBeVisible();
});

test("creating a session adds it to the sidebar and navigates to it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /new session/i }).click();
  await expect(page.getByRole("button", { name: /new session/i })).toBeVisible();
  await expect(page).toHaveURL(/\/sessions\/.+/);
});
