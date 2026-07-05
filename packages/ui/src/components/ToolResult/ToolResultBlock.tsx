import { ToolErrorBlock } from "../ToolWidgets/ToolErrorBlock";
import type { ToolResultWidgetProps } from "../ToolWidgets/types";

export const ToolResultBlock = ({
  toolName,
  outcome,
  output,
}: ToolResultWidgetProps) => {
  if (outcome === "error" || outcome === "crash") {
    return <ToolErrorBlock outcome={outcome} output={String(output)} />;
  }
  return (
    <div data-testid="tool-result" className="border border-steel/20">
      <div className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-steel">
        Tool result · {toolName} · {outcome}
      </div>
      <pre className="whitespace-pre-wrap wrap-break-word bg-gunmetal px-4 py-3 font-mono text-xs text-cream">
        {JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
};
