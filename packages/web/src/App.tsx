import { PromptInput, Workspace } from "@motherbase/ui";
import { TopBar } from "./components/TopBar";
import { useLayout } from "./hooks/useLayout";
import { useModelSelection } from "./hooks/useModelSelection";

export function App() {
  const layout = useLayout();
  const modelSelection = useModelSelection();

  return (
    <Workspace
      topBar={<TopBar />}
      leftSidebar={layout.leftSidebar}
      rightSidebar={layout.rightSidebar}
    >
      <div className="flex flex-1 flex-col min-h-0">
        <PromptInput {...modelSelection} />
      </div>
    </Workspace>
  );
}
