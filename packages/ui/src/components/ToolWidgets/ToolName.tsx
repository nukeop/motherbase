import type { FC } from "react";

type ToolNameProps = {
  name: string;
};

export const ToolName: FC<ToolNameProps> = ({ name }) => (
  <span className="flex select-none items-center gap-2 font-mono text-xs uppercase tracking-widest text-steel">
    <span>◆</span>
    <span data-testid="permission-tool-name">{name}</span>
  </span>
);
