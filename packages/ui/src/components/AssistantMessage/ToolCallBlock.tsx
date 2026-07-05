import type { ToolCallWidgetProps } from "../ToolWidgets/types";

export const ToolCallBlock = ({ toolName, input }: ToolCallWidgetProps) => {
  return (
    <div data-testid="tool-call" className="border border-steel/20">
      <div className="flex select-none items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest text-steel">
        <span>◆</span>
        <span>Tool call · {toolName}</span>
      </div>
      <pre className="whitespace-pre-wrap wrap-break-word bg-gunmetal px-4 py-3 font-mono text-xs text-cream">
        {JSON.stringify(input, null, 2)}
      </pre>
    </div>
  );
};
