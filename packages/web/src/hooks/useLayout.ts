import { useState } from "react";

const INITIAL_WIDTH = 260;

export const useLayout = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTH);
  const [rightWidth, setRightWidth] = useState(INITIAL_WIDTH);

  return {
    leftSidebar: {
      content: null,
      isCollapsed: leftCollapsed,
      width: leftWidth,
      onWidthChange: setLeftWidth,
      onToggle: () => setLeftCollapsed((v) => !v),
    },
    rightSidebar: {
      content: null,
      isCollapsed: rightCollapsed,
      width: rightWidth,
      onWidthChange: setRightWidth,
      onToggle: () => setRightCollapsed((v) => !v),
    },
  };
};
