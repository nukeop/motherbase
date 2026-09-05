import { PathBreadcrumbs } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof PathBreadcrumbs> = {
  title: "Components/PathBreadcrumbs",
  component: PathBreadcrumbs,
};

export default meta;
type Story = StoryObj<typeof PathBreadcrumbs>;

const InteractiveBreadcrumbs = ({ path }: { path: string }) => {
  const [selected, setSelected] = useState(path);
  return (
    <PathBreadcrumbs path={path} selected={selected} onSelect={setSelected} />
  );
};

export const Default: Story = {
  render: () => (
    <div className="w-150 bg-cream p-4">
      <InteractiveBreadcrumbs path="/srv/projects/acme/packages/server/src/sessions/title.ts" />
    </div>
  ),
};
