import { type FC, useState } from "react";
import { Button } from "../Button";
import { PathBreadcrumbs } from "../PathBreadcrumbs";
import { ToolName } from "./ToolName";

type ToolApprovalProps = {
  toolName: string;
  path: string;
  disabled?: boolean;
  onAllowOnce: () => void;
  onAllowAlways: (prefix: string) => void;
  onDeny: () => void;
};

export const ToolApproval: FC<ToolApprovalProps> = ({
  toolName,
  path,
  disabled = false,
  onAllowOnce,
  onAllowAlways,
  onDeny,
}) => {
  const [selected, setSelected] = useState(path);

  return (
    <fieldset
      disabled={disabled}
      data-testid="tool-approval"
      className="flex min-w-0 items-center gap-3 border border-steel/30 border-l-4 border-l-orange bg-cream-dark px-4 py-2"
    >
      <ToolName name={toolName} />
      <span data-testid="permission-path">
        <PathBreadcrumbs
          path={path}
          selected={selected}
          onSelect={setSelected}
        />
      </span>
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
    </fieldset>
  );
};
