import { PromptInput } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof PromptInput> = {
  title: "Components/PromptInput",
  component: PromptInput,
};

export default meta;
type Story = StoryObj<typeof PromptInput>;

const providers = [
  { label: "Diamond Dogs", value: "diamond-dogs" },
  { label: "Cipher", value: "cipher" },
  { label: "Outer Heaven", value: "outer-heaven" },
];

const models = [
  { label: "OCELOT-7B", value: "ocelot-7b" },
  { label: "FOXHOUND-70B", value: "foxhound-70b" },
  { label: "VENOM-SNAKE-MAX", value: "venom-snake-max" },
];

export const Default: Story = {
  render: () => {
    const [provider, setProvider] = useState(providers[0].value);
    const [model, setModel] = useState(models[0].value);
    return (
      <PromptInput
        providers={providers}
        models={models}
        selectedProvider={provider}
        selectedModel={model}
        onProviderChange={setProvider}
        onModelChange={setModel}
      />
    );
  },
};
