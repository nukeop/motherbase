import type { FC, ReactNode } from "react";
import { cn } from "../../utils";

type MainProps = {
  children?: ReactNode;
  className?: string;
};

export const Main: FC<MainProps> = ({ children, className }) => (
  <main className={cn("flex-1 min-w-0 overflow-y-auto", className)}>
    {children}
  </main>
);
