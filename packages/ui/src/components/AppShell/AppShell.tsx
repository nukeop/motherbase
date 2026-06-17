import type { FC, ReactNode } from "react";
import { cn } from "../../utils";

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

export const AppShellRoot: FC<AppShellProps> = ({ children, className }) => (
  <div
    className={cn("flex h-screen w-screen flex-col overflow-hidden", className)}
  >
    {children}
  </div>
);
