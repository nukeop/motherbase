import {
  AssistantMessage,
  Conversation,
  PromptInput,
  type SelectItem,
  UserMessage,
  Workspace,
} from "@motherbase/ui";
import { useState } from "react";

const INITIAL_WIDTH = 260;

const providers: SelectItem[] = [];
const models: SelectItem[] = [];

export function App() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTH);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTH);
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");

  return (
    <Workspace
      topBar={
        <span className="font-bold tracking-wide text-ink/80">MOTHERBASE</span>
      }
      leftSidebar={{
        content: null,
        isCollapsed: leftCollapsed,
        width: leftWidth,
        onWidthChange: setLeftWidth,
        onToggle: () => setLeftCollapsed((v) => !v),
      }}
      rightSidebar={{
        content: null,
        isCollapsed: rightCollapsed,
        width: rightWidth,
        onWidthChange: setRightWidth,
        onToggle: () => setRightCollapsed((v) => !v),
      }}
    >
      <div className="flex flex-1 flex-col min-h-0">
        <Conversation>
          <UserMessage text="I hope you brought a better hamburger this time, Kazuhira." />
          <AssistantMessage text="Right... well..." />
          <UserMessage text="The last one was lacking in every way. The patty was too thin, the bun too dry. And the lettuce... days old at best." />
          <AssistantMessage text="Huh... hey! That was 100% all-beef patty and no shortening in the bun, either." />
          <UserMessage text="Hm. Nature's blessings... unadulterated... in hamburger form. Is that it? But when taste falls short, so does our gratitude to Nature. Making such precious blessings unpalatable is sacrilege." />
        </Conversation>
        <PromptInput
          providers={providers}
          models={models}
          selectedProvider={provider}
          selectedModel={model}
          onProviderChange={setProvider}
          onModelChange={setModel}
        />
      </div>
    </Workspace>
  );
}
