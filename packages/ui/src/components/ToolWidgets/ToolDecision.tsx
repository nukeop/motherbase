import type { PermissionOutcome } from "@motherbase/core";
import type { FC } from "react";
import { cn } from "../../utils";
import { ToolName } from "./ToolName";

type ToolDecisionProps = {
  toolName: string;
  path: string;
  outcome: PermissionOutcome;
};

const decisionLabel = (outcome: PermissionOutcome): string => {
  switch (outcome.decision) {
    case "once":
      return "Allowed once";
    case "always":
      return `Allowed for this session · ${outcome.granted.path}`;
    case "deny":
      return "Denied";
  }
};

export const ToolDecision: FC<ToolDecisionProps> = ({
  toolName,
  path,
  outcome,
}) => {
  const denied = outcome.decision === "deny";

  return (
    <div
      className={cn(
        "flex items-center gap-3 border border-steel/30 border-l-4 bg-cream-dark px-4 py-2",
        { "border-l-red": denied, "border-l-steel": !denied },
      )}
    >
      <ToolName name={toolName} />
      <span
        data-testid="permission-path"
        className="font-mono text-sm text-steel"
      >
        {path}
      </span>
      <span
        data-testid="permission-decision"
        className={cn("ml-auto font-mono text-xs uppercase tracking-widest", {
          "text-red": denied,
          "text-steel": !denied,
        })}
      >
        {decisionLabel(outcome)}
      </span>
    </div>
  );
};
