import { Workspace } from "@motherbase/ui";
import { useState } from "react";

const INITIAL_WIDTH = 260;

export function App() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTH);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTH);

  return (
    <Workspace
      topBar={<span className="font-bold tracking-wide text-ink/80">MOTHERBASE</span>}
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
      Test
    </Workspace>
  );
}
