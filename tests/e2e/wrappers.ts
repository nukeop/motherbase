import { expect, type Locator, type Page } from "@playwright/test";

type ToolBlock = {
  header: Locator;
  body: Locator;
};

const toolBlock = (root: Locator): ToolBlock => ({
  header: root.locator("div > span").nth(1),
  body: root.locator("pre"),
});

const permissionCard = (root: Locator) => ({
  toolName: root.getByTestId("permission-tool-name"),
  path: root.getByTestId("permission-path"),
  decision: root.getByTestId("permission-decision"),
  alert: root.getByRole("alert"),
  allowOnceButton: root.getByRole("button", { name: "Allow once" }),
  allowAlwaysButton: root.getByRole("button", { name: "Allow always" }),
  denyButton: root.getByRole("button", { name: "Deny" }),
  crumbs: root.getByTestId("permission-path").getByRole("button"),
  async requestId(): Promise<string> {
    const id = await root.getAttribute("data-request-id");
    if (id === null) {
      throw new Error("permission card has no data-request-id");
    }
    return id;
  },
  async allowOnce() {
    await this.allowOnceButton.click();
  },
  async allowAlways(crumbLabel: string) {
    await this.crumbs.filter({ hasText: crumbLabel }).click();
    await this.allowAlwaysButton.click();
  },
  async deny() {
    await this.denyButton.click();
  },
});

export const currentSessionId = (page: Page): string =>
  page.url().split("/sessions/")[1]!;

export const sidebar = (page: Page) => ({
  list: page.getByTestId("session-list"),
  createButton: page.getByTestId("create-session"),
  session(id: string) {
    const root = page.getByTestId(`session-${id}`);
    return {
      root,
      deleteButton: root.getByTestId("delete-session"),
    };
  },
  async createSession() {
    await page.goto("/");
    await this.createButton.click();
    await expect(page).toHaveURL(/\/sessions\/.+/);
  },
});

export const modelPicker = (page: Page) => ({
  providerSelect: page.getByTestId("provider-select"),
  modelInput: page.getByPlaceholder("Search models..."),
  option(name: string) {
    return page.getByRole("option", { name });
  },
  async selectProvider(name: string) {
    await this.providerSelect.click();
    await this.option(name).click();
  },
  async openModels() {
    await this.modelInput.click();
  },
  async selectModel(name: string) {
    await this.openModels();
    await this.option(name).click();
    await expect(this.modelInput).toHaveValue(name);
  },
});

export const composer = (page: Page) => ({
  input: page.getByPlaceholder("Send a message..."),
  async send(text: string) {
    await this.input.fill(text);
    await this.input.press("Enter");
  },
});

export const conversation = (page: Page) => ({
  toolCalls: page.getByTestId("tool-call"),
  toolResults: page.getByTestId("tool-result"),
  toolErrors: page.getByTestId("tool-error"),
  errorMessages: page.getByTestId("error-message"),
  permissions: page.getByTestId("permission"),
  toolCall(index = 0): ToolBlock {
    return toolBlock(this.toolCalls.nth(index));
  },
  toolResult(index = 0): ToolBlock {
    return toolBlock(this.toolResults.nth(index));
  },
  toolError(index = 0): ToolBlock {
    return toolBlock(this.toolErrors.nth(index));
  },
  permission(index = 0) {
    return permissionCard(this.permissions.nth(index));
  },
});
