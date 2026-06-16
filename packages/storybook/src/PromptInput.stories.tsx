import { PromptInput } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PromptInput> = {
  title: "Components/PromptInput",
  component: PromptInput,
};

export default meta;
type Story = StoryObj<typeof PromptInput>;

export const Default: Story = {};
