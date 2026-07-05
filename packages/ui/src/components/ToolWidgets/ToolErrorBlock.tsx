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
    <div data-testid="tool-error" className="border border-red/40">
      <div className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-red">
        {headerText(outcome)}
      </div>
      <pre className="whitespace-pre-wrap wrap-break-word bg-gunmetal px-4 py-3 font-mono text-xs text-cream">
        {output}
      </pre>
    </div>
  );
};
