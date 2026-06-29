import { type APIRequestContext, expect, type Page } from "@playwright/test";

export const SERVER_URL = "http://localhost:4800";

type TestConfig = {
  provider: string;
  model: string;
};

const DEFAULT_TEST_CONFIG: TestConfig = {
  provider: "default-provider",
  model: "default-model",
};

export const setTestConfig = async (
  request: APIRequestContext,
  config: TestConfig = DEFAULT_TEST_CONFIG,
) => {
  await request.post(`${SERVER_URL}/_test/config`, {
    data: config,
  });
};

export const createSession = async (page: Page) => {
  await page.goto("/");
  await page.getByTestId("create-session").click();
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
