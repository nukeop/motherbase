import { getLogger } from "@logtape/logtape";
import type { SSEStreamingApi } from "hono/streaming";
import type { StreamSource } from "./types";

const logger = getLogger(["Motherbase", "SSE", "Global"]);

export class GlobalStream {
  #stream: SSEStreamingApi;
  #teardowns: (() => void)[] = [];
  readonly done: Promise<void>;

  constructor(stream: SSEStreamingApi, sources: StreamSource[]) {
    this.#stream = stream;

    logger.info("SSE client connected");
    this.write("connected", { timestamp: new Date().toISOString() });

    for (const source of sources) {
      this.attach(source);
    }

    this.done = new Promise((resolve) => {
      stream.onAbort(() => {
        logger.info("SSE client disconnected");
        this.disconnect();
        resolve();
      });
    });
  }

  write(event: string, data: unknown) {
    return this.#stream.writeSSE({ event, data: JSON.stringify(data) });
  }

  attach(source: StreamSource) {
    const teardown = source((event, data) => this.write(event, data));
    this.#teardowns.push(teardown);
  }

  disconnect() {
    for (const teardown of this.#teardowns) {
      teardown();
    }
    this.#teardowns = [];
  }
}
