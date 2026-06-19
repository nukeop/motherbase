import { ComboBox } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof ComboBox> = {
  title: "Components/ComboBox",
  component: ComboBox,
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

const items = [
  { label: "OCELOT-7B", value: "ocelot-7b" },
  { label: "FOXHOUND-70B", value: "foxhound-70b" },
  { label: "MANTIS-120B", value: "mantis-120b" },
  { label: "QUIET-WOLF-4", value: "quiet-wolf-4" },
  { label: "VENOM-SNAKE-MAX", value: "venom-snake-max" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(items[0]!.value);
    return (
      <div className="p-8">
        <ComboBox value={value} onChange={setValue} options={items} />
      </div>
    );
  },
};

export const CustomRender: Story = {
  render: () => {
    const [value, setValue] = useState(items[0]!.value);
    return (
      <div className="w-64 p-8">
        <ComboBox
          value={value}
          onChange={setValue}
          options={items}
          renderOption={(item) => (
            <div>
              <span className="font-nav text-[11px] uppercase">
                {item.label}
              </span>
              <span className="ml-2 font-mono text-[9px] text-cream/30">
                placeholder
              </span>
            </div>
          )}
        />
      </div>
    );
  },
};
