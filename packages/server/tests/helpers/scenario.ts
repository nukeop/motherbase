import type { AgentEvent, Session } from "@motherbase/core";
import type { ModelChunk } from "../../src/agent/model-client";
import type { Runner } from "../../src/agent/runner";

export type Scenario = {
  scriptTurn: (chunks: ModelChunk[]) => void;
  sendMessage: (text: string) => Promise<void>;
  readonly session: Session;
  readonly runner: Runner;
  readonly events: readonly AgentEvent[];
};

export const createScenario = (): Scenario => {
  throw new Error("not implemented");
};
