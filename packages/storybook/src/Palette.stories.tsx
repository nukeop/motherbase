import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Foundation/Palette",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

const colors = [
  {
    name: "cream",
    token: "bg-cream",
    oklch: "oklch(0.977 0.009 84.59)",
    hex: "#FAF7F1",
    desc: "Main surface",
  },
  {
    name: "cream-dark",
    token: "bg-cream-dark",
    oklch: "oklch(0.935 0.012 84.59)",
    hex: "#EDE9E1",
    desc: "Recessed surface",
  },
  {
    name: "ink",
    token: "bg-ink",
    oklch: "oklch(0.25 0.005 84.59)",
    hex: "#23211F",
    desc: "Text",
  },
  {
    name: "blue",
    token: "bg-blue",
    oklch: "oklch(0.627 0.146 252.21)",
    hex: "#3D8BDD",
    desc: "Primary accent",
  },
  {
    name: "orange",
    token: "bg-orange",
    oklch: "oklch(0.747 0.144 58.58)",
    hex: "#EF9445",
    desc: "Secondary accent",
  },
];

const Swatch = ({ color }: { color: (typeof colors)[number] }) => (
  <div className="flex items-center gap-4">
    <div
      className={`${color.token} h-16 w-16 rounded-lg border border-ink/10`}
    />
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-ink">{color.name}</span>
      <span className="text-xs text-ink/50 font-mono">{color.oklch}</span>
      <span className="text-xs text-ink/50 font-mono">{color.hex}</span>
      <span className="text-xs text-ink/40">{color.desc}</span>
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-6 rounded-xl bg-cream p-8">
      {colors.map((c) => (
        <Swatch key={c.name} color={c} />
      ))}
    </div>
  ),
};
