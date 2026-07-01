import type { AgentEvent } from "@motherbase/core";
import type { StreamSource, WriteEvent } from "../types";

const writers = new Map<string, WriteEvent>();

export const sessionSource =
  (sessionId: string): StreamSource =>
  (write) => {
    writers.set(sessionId, write);
    return () => {
      if (writers.get(sessionId) === write) {
        writers.delete(sessionId);
      }
    };
  };

export const emitToSession = (sessionId: string, event: AgentEvent) =>
  writers.get(sessionId)?.(event.type, event);
