import type { JsonValue } from "@motherbase/core";
import type { ComponentType } from "react";
import { ToolCallBlock } from "../AssistantMessage/ToolCallBlock";
import { ToolResultBlock } from "../ToolResult/ToolResultBlock";
import { ReadToolCall } from "./ReadToolCall";
import { ReadToolResult } from "./ReadToolResult";
import type {
  ToolCallWidgetProps,
  ToolResultWidgetProps,
  ToolWidgets,
} from "./types";

const defineWidgets = <I extends JsonValue, O extends JsonValue>(entry: {
  call?: ComponentType<ToolCallWidgetProps<I>>;
  result?: ComponentType<ToolResultWidgetProps<O>>;
}): ToolWidgets => {
  return entry as unknown as ToolWidgets;
};

const overrides: Record<string, ToolWidgets> = {
  read: defineWidgets({ call: ReadToolCall, result: ReadToolResult }),
};

export const resolveCallWidget = (toolName: string) => {
  return overrides[toolName]?.call ?? ToolCallBlock;
};

export const resolveResultWidget = (toolName: string) => {
  return overrides[toolName]?.result ?? ToolResultBlock;
};
