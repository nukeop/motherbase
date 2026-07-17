import { PathBreadcrumbs } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PathBreadcrumbs> = {
  title: "Components/PathBreadcrumbs",
  component: PathBreadcrumbs,
};

export default meta;
type Story = StoryObj<typeof PathBreadcrumbs>;

export const Default: Story = {
  render: () => (
    <div className="w-150 bg-cream p-4">
      <PathBreadcrumbs
        path="/tmp/build/cache.json"
        selected="/tmp/build/cache.json"
        onSelect={() => {}}
      />
    </div>
  ),
};
