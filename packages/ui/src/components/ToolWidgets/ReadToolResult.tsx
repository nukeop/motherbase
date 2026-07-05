import { ToolErrorBlock } from "./ToolErrorBlock";
import type { ToolResultWidgetProps } from "./types";

export const ReadToolResult = ({ outcome, output }: ToolResultWidgetProps) => {
  if (outcome === "success") {
    return null;
  }
  return <ToolErrorBlock outcome={outcome} output={output} />;
};
