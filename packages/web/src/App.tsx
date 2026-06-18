import {
  PromptInput,
  Workspace,
} from "@motherbase/ui";
import { useLayout } from "./hooks/useLayout";
import { useModelSelection } from "./hooks/useModelSelection";

export function App() {
  const layout = useLayout();
  const modelSelection = useModelSelection();

  return (
    <Workspace
      topBar={
        <span className="font-bold tracking-wide text-ink/80">MOTHERBASE</span>
      }
      leftSidebar={layout.leftSidebar}
      rightSidebar={layout.rightSidebar}
    >
      <div className="flex flex-1 flex-col min-h-0">
        <PromptInput {...modelSelection} />
      </div>
    </Workspace>
  );
}
