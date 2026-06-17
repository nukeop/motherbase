import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Foundation/Typography",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

const sample =
  "That's an enemy gunship. A single burst from its machine gun can cut a man in half.";

const FontStack = ({
  name,
  token,
  family,
  weights,
}: {
  name: string;
  token: string;
  family: string;
  weights: { label: string; className: string }[];
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-baseline gap-3">
      <span className="text-sm font-bold text-ink">{name}</span>
      <span className="text-xs text-ink/40 font-mono">{token}</span>
      <span className="text-xs text-ink/40">{family}</span>
    </div>
    <div className="flex flex-col gap-2">
      {weights.map(({ label, className }) => (
        <div key={label} className="flex items-baseline gap-4">
          <span className="w-20 shrink-0 text-xs text-ink/40">{label}</span>
          <span className={`${token} ${className} text-2xl text-ink`}>
            {sample}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-10 rounded-xl bg-cream p-10">
      <FontStack
        name="Rodin"
        token="font-body"
        family="Body text, headings, UI labels"
        weights={[
          { label: "Light (300)", className: "font-light" },
          { label: "Regular (400)", className: "font-normal" },
          { label: "Bold (700)", className: "font-bold" },
        ]}
      />
      <hr className="border-ink/10" />
      <FontStack
        name="Chakra Petch"
        token="font-nav"
        family="Navigation, section labels"
        weights={[
          { label: "Regular (400)", className: "font-normal" },
          { label: "Medium (500)", className: "font-medium" },
          { label: "Bold (700)", className: "font-bold" },
        ]}
      />
      <hr className="border-ink/10" />
      <FontStack
        name="JetBrains Mono"
        token="font-mono"
        family="Code, paths, terminal output"
        weights={[
          { label: "Regular (400)", className: "font-normal" },
          { label: "Bold (700)", className: "font-bold" },
        ]}
      />
    </div>
  ),
};
