import { expect, type Page } from "@playwright/test";

export const SERVER_URL = "http://localhost:4800";

export const createSession = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: /new session/i }).click();
  await expect(page).toHaveURL(/\/sessions\/.+/);
};

export const selectProvider = async (page: Page, name: string) => {
  await page.getByRole("button", { name: "Select..." }).click();
  await page.getByRole("option", { name }).click();
};

export const selectModel = async (page: Page, name: string) => {
  await page.getByPlaceholder("Search models...").click();
  await page.getByRole("option", { name: new RegExp(name) }).click();
};
