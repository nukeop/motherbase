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

const DEFAULT_TEST_PROVIDER = {
  id: "default-provider",
  name: "Default Provider",
  models: [{ id: "default-model", name: "Default Model" }],
};

type TestTool =
  | { name: string; description: string; behavior: "success"; output: unknown }
  | {
    name: string;
    description: string;
    behavior: "tool-error";
    message: string;
  }
  | { name: string; description: string; behavior: "crash"; message: string };

export const registerTools = async (
  request: APIRequestContext,
  tools: TestTool[],
) => {
  await request.post(`${SERVER_URL}/_test/tools`, {
    data: { tools },
  });
};

export const setTestConfig = async (
  request: APIRequestContext,
  config: TestConfig = DEFAULT_TEST_CONFIG,
) => {
  await request.post(`${SERVER_URL}/_test/config`, {
    data: config,
  });
  await request.post(`${SERVER_URL}/_test/providers`, {
    data: { providers: [DEFAULT_TEST_PROVIDER] },
  });
};

export const createSession = async (page: Page) => {
  await page.goto("/");
  await page.getByTestId("create-session").click();
  await expect(page).toHaveURL(/\/sessions\/.+/);
};

export const selectProvider = async (page: Page, name: string) => {
  await page.getByTestId("provider-select").click();
  await page.getByRole("option", { name }).click();
};

export const selectModel = async (page: Page, name: string) => {
  const combobox = page.getByPlaceholder("Search models...");
  await combobox.click();
  await page.getByRole("option", { name }).click();
  // The selection round-trips through a PATCH and a session refetch before
  // the UI settles; typing during that window races the re-render.
  await expect(combobox).toHaveValue(name);
};
