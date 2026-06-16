import { Conversation } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Conversation> = {
  title: "Components/Conversation",
  component: Conversation,
};

export default meta;
type Story = StoryObj<typeof Conversation>;

export const Default: Story = {};
