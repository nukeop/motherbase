import { Button } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <div className="flex gap-3 bg-cream p-4">
      <Button variant="default" onClick={() => {}}>
        Default
      </Button>
      <Button variant="confirm" onClick={() => {}}>
        Confirm
      </Button>
      <Button variant="danger" onClick={() => {}}>
        Danger
      </Button>
    </div>
  ),
};
