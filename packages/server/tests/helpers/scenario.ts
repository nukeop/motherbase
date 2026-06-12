import { type AgentEvent, Session } from "@motherbase/core";
import {
  createModelClient,
  type ModelChunk,
} from "../../src/agent/model-client";
import { Runner } from "../../src/agent/runner";
import { createMockModel } from "./mock-model";

export type Scenario = {
  scriptTurn: (chunks: ModelChunk[]) => void;
  sendMessage: (text: string) => Promise<void>;
  readonly session: Session;
  readonly runner: Runner;
  readonly events: readonly AgentEvent[];
};

export const createScenario = (): Scenario => {
  const events: AgentEvent[] = [];
  const session = Session.create({ projectId: crypto.randomUUID() });
  let script: ModelChunk[];
  let runner: Runner;

  return {
    scriptTurn: (chunks) => {
      script = chunks;
    },
    sendMessage: async (text) => {
      runner = new Runner(session, {
        model: createModelClient(createMockModel(script)),
        emit: (event) => events.push(event),
      });
      await runner.send({
        kind: "message",
        role: "user",
        parts: [{ type: "text", text }],
      });
    },
    session,
    get runner() {
      return runner;
    },
    events,
  };
};
