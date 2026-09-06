import { bus } from "../../events";
import type { StreamSource } from "../types";

export const sessionSource =
  (sessionId: string): StreamSource =>
  (write) =>
    bus.on(sessionId, (event) => write(event.type, event));
