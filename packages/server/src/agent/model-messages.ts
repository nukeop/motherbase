import type { ModelEntry, ToolResultEntry } from "@motherbase/core";
import type { ModelMessage, ToolResultPart } from "ai";

const toResultOutput = (entry: ToolResultEntry): ToolResultPart["output"] => {
  if (entry.outcome === "success") {
    return { type: "json", value: entry.output };
  }
  return { type: "error-json", value: entry.output };
};

const toModelMessage = (entry: ModelEntry): ModelMessage => {
  if (entry.kind === "tool-result") {
    return {
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: entry.toolCallId,
          toolName: entry.toolName,
          output: toResultOutput(entry),
        },
      ],
    };
  }

  if (entry.role === "user") {
    const text = entry.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");
    return { role: "user", content: text };
  }

  return { role: "assistant", content: entry.parts };
};

export const toModelMessages = (
  entries: readonly ModelEntry[],
): ModelMessage[] => entries.map(toModelMessage);
