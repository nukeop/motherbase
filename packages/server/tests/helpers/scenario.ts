import type { AgentEvent, HistoryEntry, MachineState } from "@motherbase/core";
import type { ModelChunk } from "../../src/agent/model-client";

export type Scenario = {
  scriptTurn: (chunks: ModelChunk[]) => void;
  sendMessage: (text: string) => Promise<void>;
  readonly events: readonly AgentEvent[];
  readonly state: MachineState;
  readonly history: readonly HistoryEntry[];
};

export const createScenario = (): Scenario => {
  throw new Error("not implemented: lands with the core schemas and runner");
};
