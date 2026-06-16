import { motion } from "motion/react";
import type { FC, ReactNode } from "react";
import { transitions } from "../../motion";
import { cn } from "../../utils";
import { SIDEBAR } from "./constants";
import { useSidebarResize } from "./useSidebarResize";

type SidebarProps = {
  children?: ReactNode;
  side: "left" | "right";
  isCollapsed: boolean;
  width: number;
  onWidthChange: (width: number) => void;
  onToggle: () => void;
  className?: string;
};

export const Sidebar: FC<SidebarProps> = ({
  children,
  side,
  isCollapsed,
  width,
  onWidthChange,
  className,
}) => {
  const { isDragging, handleProps } = useSidebarResize(side, width, onWidthChange);
  const currentWidth = isCollapsed ? SIDEBAR.collapsedWidth : width;

  return (
    <motion.aside
      data-side={side}
      className={cn("relative flex flex-col overflow-hidden", className)}
      animate={{ width: currentWidth }}
      transition={isDragging ? transitions.instant : transitions.snappy}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>

      {!isCollapsed && (
        <div
          className={cn(
            "absolute top-0 bottom-0 w-1 cursor-col-resize",
            {
              "right-0": side === "left",
              "left-0": side === "right",
            },
          )}
          {...handleProps}
        />
      )}
    </motion.aside>
  );
};
