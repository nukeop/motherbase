import type { StateHandler } from "../types";

export const preparingContext: StateHandler = async (ctx) => {
  return { type: "streaming" };
};
