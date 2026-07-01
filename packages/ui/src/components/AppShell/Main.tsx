import type { FC, ReactNode } from "react";
import { cn } from "../../utils";

type MainProps = {
  children?: ReactNode;
  className?: string;
};

export const Main: FC<MainProps> = ({ children, className }) => (
  <main
    className={cn("flex flex-1 flex-col min-w-0 overflow-hidden", className)}
  >
    {children}
  </main>
);
