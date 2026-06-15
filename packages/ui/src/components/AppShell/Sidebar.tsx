import type { FC, ReactNode } from "react";
import { cn } from "../../utils";

type SidebarProps = {
  children?: ReactNode;
  side: "left" | "right";
  className?: string;
};

export const Sidebar: FC<SidebarProps> = ({ children, side, className }) => (
  <aside
    data-side={side}
    className={cn("flex flex-col overflow-hidden", className)}
  >
    {children}
  </aside>
);
