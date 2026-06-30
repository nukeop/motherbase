import type { StateHandler } from "../types";

export const streaming: StateHandler = async (ctx) => {
  return { type: "completing" };
};
