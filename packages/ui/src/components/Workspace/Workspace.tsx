import type { FC, ReactNode } from "react";
import { cn } from "../../utils";
import { AppShell } from "../AppShell";

type SidebarSlot = {
  content: ReactNode;
  isCollapsed: boolean;
  width: number;
  onWidthChange: (width: number) => void;
  onToggle: () => void;
};

type WorkspaceProps = {
  topBar?: ReactNode;
  leftSidebar?: SidebarSlot;
  rightSidebar?: SidebarSlot;
  children: ReactNode;
  className?: string;
};

export const Workspace: FC<WorkspaceProps> = ({
  topBar,
  leftSidebar,
  rightSidebar,
  children,
  className,
}) => (
  <AppShell className={cn("bg-cream-dark font-body text-ink", className)}>
    {topBar && (
      <AppShell.TopBar className="flex items-center px-4 h-11 font-nav text-sm">
        {topBar}
      </AppShell.TopBar>
    )}
    <div className="flex flex-1 min-h-0 p-2 pt-0 gap-2">
      {leftSidebar && (
        <AppShell.Sidebar
          side="left"
          isCollapsed={leftSidebar.isCollapsed}
          width={leftSidebar.width}
          onWidthChange={leftSidebar.onWidthChange}
          onToggle={leftSidebar.onToggle}
          className="bg-ink"
        >
          {leftSidebar.content}
        </AppShell.Sidebar>
      )}
      <AppShell.Main className="bg-cream rounded-lg border border-ink/15">
        {children}
      </AppShell.Main>
      {rightSidebar && (
        <AppShell.Sidebar
          side="right"
          isCollapsed={rightSidebar.isCollapsed}
          width={rightSidebar.width}
          onWidthChange={rightSidebar.onWidthChange}
          onToggle={rightSidebar.onToggle}
        >
          {rightSidebar.content}
        </AppShell.Sidebar>
      )}
    </div>
  </AppShell>
);
