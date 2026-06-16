import { Workspace } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof Workspace> = {
  title: "Layout/Workspace",
  component: Workspace,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Workspace>;

const INITIAL_WIDTH = 260;

const Label = ({ text }: { text: string }) => (
  <div className="flex h-full items-center justify-center text-xs text-ink/30">
    {text}
  </div>
);

const Interactive = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTH);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTH);

  return (
    <Workspace
      topBar={<Label text="top bar" />}
      leftSidebar={{
        content: <Label text="left sidebar" />,
        isCollapsed: leftCollapsed,
        width: leftWidth,
        onWidthChange: setLeftWidth,
        onToggle: () => setLeftCollapsed((v) => !v),
      }}
      rightSidebar={{
        content: <Label text="right sidebar" />,
        isCollapsed: rightCollapsed,
        width: rightWidth,
        onWidthChange: setRightWidth,
        onToggle: () => setRightCollapsed((v) => !v),
      }}
    >
      <Label text="main" />
    </Workspace>
  );
};

export const Default: Story = {
  render: () => <Interactive />,
};
