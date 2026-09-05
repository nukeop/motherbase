import { type FC, useState } from "react";
import { Button } from "../Button";
import { PathBreadcrumbs } from "../PathBreadcrumbs";

type ToolApprovalProps = {
  toolName: string;
  path: string;
  onAllowOnce: () => void;
  onAllowAlways: (prefix: string) => void;
  onDeny: () => void;
};

export const ToolApproval: FC<ToolApprovalProps> = ({
  toolName,
  path,
  onAllowOnce,
  onAllowAlways,
  onDeny,
}) => {
  const [selected, setSelected] = useState(path);

  return (
    <div
      data-testid="tool-approval"
      className="flex items-center gap-3 border border-steel/30 border-l-4 border-l-orange bg-cream-dark px-4 py-2"
    >
      <span className="flex select-none items-center gap-2 font-mono text-xs uppercase tracking-widest text-steel">
        <span>◆</span>
        <span>{toolName}</span>
      </span>
      <PathBreadcrumbs path={path} selected={selected} onSelect={setSelected} />
      <span className="ml-auto flex items-center gap-2">
        <Button variant="confirm" onClick={onAllowOnce}>
          Allow once
        </Button>
        <Button variant="confirm" onClick={() => onAllowAlways(selected)}>
          Allow always
        </Button>
        <Button variant="danger" onClick={onDeny}>
          Deny
        </Button>
      </span>
    </div>
  );
};
