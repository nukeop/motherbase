import { AppShell } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof AppShell> = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const Label = ({ text }: { text: string }) => (
  <div className="flex h-full items-center justify-center text-xs text-neutral-500">
    {text}
  </div>
);

const INITIAL_WIDTH = 260;

const Interactive = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTH);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTH);

  return (
    <AppShell className="bg-neutral-950 text-neutral-100">
      <AppShell.TopBar className="h-10 border-b border-neutral-800">
        <Label text="top bar" />
      </AppShell.TopBar>
      <div className="flex flex-1 min-h-0">
        <AppShell.Sidebar
          side="left"
          isCollapsed={leftCollapsed}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          onToggle={() => setLeftCollapsed((v) => !v)}
          className="border-r border-neutral-800"
        >
          <button
            onClick={() => setLeftCollapsed((v) => !v)}
            className="m-2 rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
          >
            toggle
          </button>
          {!leftCollapsed && <Label text="left sidebar" />}
        </AppShell.Sidebar>
        <AppShell.Main>
          <Label text="main" />
        </AppShell.Main>
        <AppShell.Sidebar
          side="right"
          isCollapsed={rightCollapsed}
          width={rightWidth}
          onWidthChange={setRightWidth}
          onToggle={() => setRightCollapsed((v) => !v)}
          className="border-l border-neutral-800"
        >
          <button
            onClick={() => setRightCollapsed((v) => !v)}
            className="m-2 rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
          >
            toggle
          </button>
          {!rightCollapsed && <Label text="right sidebar" />}
        </AppShell.Sidebar>
      </div>
    </AppShell>
  );
};

export const Default: Story = {
  render: () => <Interactive />,
};
