import { PromptInput, Workspace } from "@motherbase/ui";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SessionSidebar } from "../components/SessionSidebar";
import { TopBar } from "../components/TopBar";
import { useLayout } from "../hooks/useLayout";
import { useModelSelection } from "../hooks/useModelSelection";

const RootLayout = () => {
  const layout = useLayout();
  const modelSelection = useModelSelection();

  return (
    <Workspace
      topBar={<TopBar />}
      leftSidebar={{
        ...layout.leftSidebar,
        content: <SessionSidebar />,
      }}
      rightSidebar={layout.rightSidebar}
    >
      <div className="flex flex-1 flex-col min-h-0">
        <Outlet />
        <PromptInput {...modelSelection} />
      </div>
    </Workspace>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
