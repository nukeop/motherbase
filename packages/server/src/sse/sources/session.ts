import { bus } from "../../events";
import type { StreamSource } from "../types";

export const sessionSource =
  (sessionId: string): StreamSource =>
  (write) =>
    bus.on(sessionId, "*", ({ name, payload }) =>
      write(name, { type: name, ...payload }),
    );
