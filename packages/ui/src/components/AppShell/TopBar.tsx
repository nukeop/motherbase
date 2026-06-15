import type { FC, ReactNode } from "react";
import { cn } from "../../utils";

type TopBarProps = {
  children?: ReactNode;
  className?: string;
};

export const TopBar: FC<TopBarProps> = ({ children, className }) => (
  <header className={cn("flex-none", className)}>
    {children}
  </header>
);
