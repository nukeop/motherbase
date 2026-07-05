import type { JsonValue } from "@motherbase/core";
import type { ComponentType } from "react";

export type ToolCallWidgetProps<Input extends JsonValue = JsonValue> = {
  toolName: string;
  input: Input;
};

export type ToolResultWidgetProps<Output extends JsonValue = JsonValue> = {
  toolName: string;
  outcome: "success" | "error" | "crash";
  output: Output;
};

export type ToolWidgets = {
  call?: ComponentType<ToolCallWidgetProps>;
  result?: ComponentType<ToolResultWidgetProps>;
};
