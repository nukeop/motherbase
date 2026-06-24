import { expect, test } from "@playwright/test";

test("user sends a message and sees the streamed response", async ({ page, request }) => {
  await request.post("http://localhost:4800/_test/script", {
    data: {
      chunks: [
        { type: "text-delta", text: "Hello" },
        { type: "text-delta", text: " from" },
        { type: "text-delta", text: " Motherbase" },
        { type: "finish", reason: "stop" },
      ],
    },
  });

  await page.goto("/");
  await page.getByRole("button", { name: /new session/i }).click();
  await expect(page).toHaveURL(/\/sessions\/.+/);

  await page.getByPlaceholder("Send a message...").fill("Hello Motherbase");
  await page.keyboard.press("Enter");

  await expect(page.getByText("Hello Motherbase")).toBeVisible();
  await expect(page.getByText("Hello from Motherbase")).toBeVisible();
});
