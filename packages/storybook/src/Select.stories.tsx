import { Select } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const models = [
  { label: "OCELOT-7B", value: "ocelot-7b" },
  { label: "FOXHOUND-70B", value: "foxhound-70b" },
  { label: "MANTIS-120B", value: "mantis-120b" },
  { label: "QUIET-WOLF-4", value: "quiet-wolf-4" },
  { label: "VENOM-SNAKE-MAX", value: "venom-snake-max" },
];

const providers = [
  { label: "Diamond Dogs", value: "diamond-dogs" },
  { label: "Cipher", value: "cipher" },
  { label: "Outer Heaven", value: "outer-heaven" },
];

export const ModelSelector: Story = {
  render: () => {
    const [value, setValue] = useState(models[0].value);
    return (
      <div className="p-8">
        <Select value={value} onChange={setValue} options={models} />
      </div>
    );
  },
};

export const ProviderSelector: Story = {
  render: () => {
    const [value, setValue] = useState(providers[0].value);
    return (
      <div className="p-8">
        <Select value={value} onChange={setValue} options={providers} />
      </div>
    );
  },
};
