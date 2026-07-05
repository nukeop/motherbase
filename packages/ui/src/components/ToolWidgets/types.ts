import type { ComponentType } from "react";

export type ToolCallWidgetProps = {
  toolName: string;
  input: unknown;
};

export type ToolResultWidgetProps = {
  toolName: string;
  outcome: "success" | "error" | "crash";
  output: unknown;
};

export type ToolWidgets = {
  call?: ComponentType<ToolCallWidgetProps>;
  result?: ComponentType<ToolResultWidgetProps>;
};
