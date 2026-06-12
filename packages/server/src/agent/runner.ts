import type { MachineState, MessageEntry, Session } from "@motherbase/core";

export type Runner = {
  readonly state: MachineState;
  send: (message: MessageEntry) => Promise<void>;
};

export const createRunner = (session: Session): Runner => {
  throw new Error("not implemented");
};
