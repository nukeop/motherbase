import type { ReadInput, ToolCallWidgetProps } from "./types";



const splitPath = (filePath: string) => {
  const basenameStart = filePath.lastIndexOf("/") + 1;
  return {
    dirname: filePath.slice(0, basenameStart),
    basename: filePath.slice(basenameStart),
  };
};

const rangeSuffix = ({ offset, limit }: ReadInput): string | null => {
  if (offset === undefined || limit === undefined) {
    return null;
  }
  return `:${offset}-${offset + limit - 1}`;
};

export const ReadToolCall = ({ input }: ToolCallWidgetProps) => {
  const read = input as ReadInput;
  const { dirname, basename } = splitPath(read.filePath);
  const suffix = rangeSuffix(read);
  return (
    <div
      data-testid="read-tool-call"
      className="flex items-baseline gap-3 px-4 py-2"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-steel">
        read
      </span>
      <span className="font-mono text-sm">
        <span className="text-steel">{dirname}</span>
        <span className="text-cream">{basename}</span>
        {suffix !== null && <span className="text-steel">{suffix}</span>}
      </span>
    </div>
  );
};
