import { ReadToolCall, ToolErrorBlock, ToolResultBlock } from "@motherbase/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ReadToolCall> = {
  title: "Components/ToolWidgets",
  component: ReadToolCall,
};

export default meta;
type Story = StoryObj<typeof ReadToolCall>;

const notFoundMessage =
  "File not found: /projects/app/NOTES\nDid you mean one of these?\n- notes.txt\n- notes.md\n- NOTES.org";

export const ReadCall: Story = {
  render: () => (
    <div className="w-150 bg-gunmetal">
      <ReadToolCall
        toolName="read"
        input={{ filePath: "/projects/app/src/notes.txt" }}
      />
    </div>
  ),
};

export const ReadCallWithRange: Story = {
  render: () => (
    <div className="w-150 bg-gunmetal">
      <ReadToolCall
        toolName="read"
        input={{
          filePath: "/projects/app/src/notes.txt",
          offset: 100,
          limit: 200,
        }}
      />
    </div>
  ),
};

export const ToolError: Story = {
  render: () => (
    <div className="w-150 bg-gunmetal">
      <ToolErrorBlock outcome="error" output={notFoundMessage} />
    </div>
  ),
};

export const ToolCrash: Story = {
  render: () => (
    <div className="w-150 bg-gunmetal">
      <ToolErrorBlock
        outcome="crash"
        output="they played us like a damn fiddle!"
      />
    </div>
  ),
};

export const DefaultResult: Story = {
  render: () => (
    <div className="w-150 bg-gunmetal">
      <ToolResultBlock
        toolName="echo"
        outcome="success"
        output={{ echoed: "ping" }}
      />
    </div>
  ),
};
