import { AppShell } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Default: Story = {
  render: () => (
    <AppShell className="bg-neutral-950 text-neutral-100">
      <AppShell.TopBar className="h-10 border-b border-neutral-800">
        <Label text="top bar" />
      </AppShell.TopBar>
      <div className="flex flex-1 min-h-0">
        <AppShell.Sidebar side="left" className="w-64 border-r border-neutral-800">
          <Label text="left sidebar" />
        </AppShell.Sidebar>
        <AppShell.Main>
          <Label text="main" />
        </AppShell.Main>
        <AppShell.Sidebar side="right" className="w-80 border-l border-neutral-800">
          <Label text="right sidebar" />
        </AppShell.Sidebar>
      </div>
    </AppShell>
  ),
};
