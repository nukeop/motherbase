import type { StateHandler } from "../types";

export const messageReceived: StateHandler = async (ctx) => {
  return { type: "preparing-context" };
};
