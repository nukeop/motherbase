import {
  ReadToolCall,
  ToolApproval,
  ToolDecision,
  ToolErrorBlock,
  ToolResultBlock,
} from "@motherbase/ui";
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
    <div className="w-150 bg-cream p-4">
      <ReadToolCall
        toolName="read"
        input={{ filePath: "/projects/app/src/notes.txt" }}
      />
    </div>
  ),
};

export const ReadCallWithRange: Story = {
  render: () => (
    <div className="w-150 bg-cream p-4">
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
    <div className="w-150 bg-cream p-4">
      <ToolErrorBlock outcome="error" output={notFoundMessage} />
    </div>
  ),
};

export const ToolCrash: Story = {
  render: () => (
    <div className="w-150 bg-cream p-4">
      <ToolErrorBlock
        outcome="crash"
        output="they played us like a damn fiddle!"
      />
    </div>
  ),
};

export const Approval: Story = {
  render: () => (
    <div className="w-200 bg-cream p-4">
      <ToolApproval
        toolName="read"
        path="/tmp/build/cache.json"
        onAllowOnce={() => {}}
        onAllowAlways={() => {}}
        onDeny={() => {}}
      />
    </div>
  ),
};

export const ApprovalSubmitting: Story = {
  render: () => (
    <div className="w-200 bg-cream p-4">
      <ToolApproval
        toolName="read"
        path="/tmp/build/cache.json"
        disabled
        onAllowOnce={() => {}}
        onAllowAlways={() => {}}
        onDeny={() => {}}
      />
    </div>
  ),
};

export const DecisionAllowedOnce: Story = {
  render: () => (
    <div className="w-200 bg-cream p-4">
      <ToolDecision
        toolName="read"
        path="/tmp/build/cache.json"
        outcome={{ decision: "once", granted: null }}
      />
    </div>
  ),
};

export const DecisionAllowedAlways: Story = {
  render: () => (
    <div className="w-200 bg-cream p-4">
      <ToolDecision
        toolName="read"
        path="/tmp/build/cache.json"
        outcome={{
          decision: "always",
          granted: { verb: "read", path: "/tmp/build" },
        }}
      />
    </div>
  ),
};

export const DecisionDenied: Story = {
  render: () => (
    <div className="w-200 bg-cream p-4">
      <ToolDecision
        toolName="read"
        path="/tmp/build/cache.json"
        outcome={{ decision: "deny", granted: null }}
      />
    </div>
  ),
};

export const DefaultResult: Story = {
  render: () => (
    <div className="w-150 bg-cream p-4">
      <ToolResultBlock
        toolName="echo"
        outcome="success"
        output={{ echoed: "ping" }}
      />
    </div>
  ),
};
