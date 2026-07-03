import type { ToolCallPart } from "@motherbase/core";
import type { ModelChunk } from "../../src/agent/model-chunk";
import type { Scenario } from "../harness/scenario";

export const scriptToolCallTurn = (
  scenario: Scenario,
  calls: Omit<ToolCallPart, "type">[],
  prefixText?: string,
): void => {
  const chunks: ModelChunk[] = [];
  if (prefixText) {
    chunks.push({ type: "text-start" });
    chunks.push({ type: "text-delta", text: prefixText });
  }
  for (const call of calls) {
    chunks.push({ type: "tool-call", ...call });
  }
  chunks.push({ type: "finish", reason: "tool-calls" });
  scenario.scriptTurn(chunks);
};

export const scriptTextReply = (scenario: Scenario, text: string): void => {
  scenario.scriptTurn([
    { type: "text-start" },
    { type: "text-delta", text },
    { type: "finish", reason: "stop" },
  ]);
};
