type ToolCallBlockProps = {
  toolName: string;
  input: unknown;
};

export const ToolCallBlock = ({ toolName, input }: ToolCallBlockProps) => {
  return (
    <div data-testid="tool-call" className="border border-steel/20">
      <div className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-steel">
        Tool call · {toolName}
      </div>
      <pre className="whitespace-pre-wrap wrap-break-word bg-gunmetal px-4 py-3 font-mono text-xs text-cream">
        {JSON.stringify(input, null, 2)}
      </pre>
    </div>
  );
};
