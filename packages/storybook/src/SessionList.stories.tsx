import { SessionList } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof SessionList> = {
  title: "Components/SessionList",
  component: SessionList,
};

export default meta;
type Story = StoryObj<typeof SessionList>;

const sessions = [
  { id: "1", title: "The Ultimate Hamburger" },
  { id: "2", title: "Skull Face's Objective" },
  { id: "3", title: "Code Talker and His Research" }
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState("2");
    return (
      <div className="w-64 bg-gunmetal">
        <SessionList
          sessions={sessions}
          selectedId={selected}
          onSelect={setSelected}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="w-64 bg-gunmetal">
      <SessionList sessions={[]} onSelect={() => { }} />
    </div>
  ),
};

export const SingleSession: Story = {
  render: () => (
    <div className="w-64 bg-gunmetal">
      <SessionList
        sessions={[{ id: "1", title: "New Session" }]}
        selectedId="1"
        onSelect={() => { }}
      />
    </div>
  ),
};
