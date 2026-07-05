import type { Locator, Page } from "@playwright/test";

type ToolBlock = {
  header: Locator;
  body: Locator;
};

const toolBlock = (root: Locator): ToolBlock => ({
  header: root.locator("div > span").nth(1),
  body: root.locator("pre"),
});

export const conversation = (page: Page) => ({
  toolCalls: page.getByTestId("tool-call"),
  toolResults: page.getByTestId("tool-result"),
  toolErrors: page.getByTestId("tool-error"),
  errorMessages: page.getByTestId("error-message"),
  toolCall(index = 0): ToolBlock {
    return toolBlock(this.toolCalls.nth(index));
  },
  toolResult(index = 0): ToolBlock {
    return toolBlock(this.toolResults.nth(index));
  },
  toolError(index = 0): ToolBlock {
    return toolBlock(this.toolErrors.nth(index));
  },
});
