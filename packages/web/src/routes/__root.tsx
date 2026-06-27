import { Workspace } from "@motherbase/ui";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SessionSidebar } from "../components/SessionSidebar";
import { TopBar } from "../components/TopBar";
import { useLayout } from "../hooks/useLayout";

const RootLayout = () => {
  const layout = useLayout();

  return (
    <Workspace
      topBar={<TopBar />}
      leftSidebar={{
        ...layout.leftSidebar,
        content: <SessionSidebar />,
      }}
      rightSidebar={layout.rightSidebar}
    >
      <Outlet />
    </Workspace>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
