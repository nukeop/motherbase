import type { ReadToolOutput } from "@motherbase/core";
import { ToolErrorBlock } from "./ToolErrorBlock";
import type { ToolResultWidgetProps } from "./types";

export const ReadToolResult = ({
  outcome,
  output,
}: ToolResultWidgetProps<ReadToolOutput>) => {
  if (outcome === "success") {
    return null;
  }
  return <ToolErrorBlock outcome={outcome} output={output} />;
};
