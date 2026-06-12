import type {
  AgentEvent,
  MachineState,
  MessageEntry,
  Session,
} from "@motherbase/core";
import type { ModelClient } from "./model-client";

export type Deps = {
  model: ModelClient;
  emit: (event: AgentEvent) => void;
};

export type Runner = {
  readonly state: MachineState;
  send: (message: MessageEntry) => Promise<void>;
};

export const createRunner = (session: Session, deps: Deps): Runner => {
  throw new Error("not implemented");
};
