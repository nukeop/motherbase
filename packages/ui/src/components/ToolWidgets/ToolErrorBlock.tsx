import { CornerAccent } from "../UserMessage/CornerAccent";

type FailureOutcome = "error" | "crash";

type ToolErrorBlockProps = {
  outcome: FailureOutcome;
  output: string;
};

const headerText = (outcome: FailureOutcome): string => {
  switch (outcome) {
    case "error":
      return "Tool error";
    case "crash":
      return "Tool crashed";
  }
};

export const ToolErrorBlock = ({ outcome, output }: ToolErrorBlockProps) => {
  return (
    <div
      data-testid="tool-error"
      className="relative border border-red/30 bg-red/10"
    >
      <CornerAccent position="top-left" className="border-red" />
      <CornerAccent position="bottom-right" className="border-red" />
      <div className="flex select-none items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-widest text-red">
        <span>◆</span>
        <span>{headerText(outcome)}</span>
      </div>
      <pre className="whitespace-pre-wrap wrap-break-word px-4 pb-3 pt-1 font-mono text-xs text-ink">
        {output}
      </pre>
    </div>
  );
};
