import { AssistantMessage, Conversation, UserMessage } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Conversation> = {
  title: "Components/Conversation",
  component: Conversation,
};

export default meta;
type Story = StoryObj<typeof Conversation>;

export const Default: Story = {
  render: () => (
    <Conversation>
      <UserMessage text="I hope you brought a better hamburger this time, Kazuhira." />
      <AssistantMessage text="Right... well..." />
      <UserMessage text="The last one was lacking in every way. The patty was too thin, the bun too dry. And the lettuce... days old at best." />
      <AssistantMessage text="Huh... hey! That was 100% all-beef patty and no shortening in the bun, either." />
      <UserMessage text="Hm. Nature's blessings... unadulterated... in hamburger form. Is that it? But when taste falls short, so does our gratitude to Nature. Making such precious blessings unpalatable is sacrilege." />
    </Conversation>
  ),
};
