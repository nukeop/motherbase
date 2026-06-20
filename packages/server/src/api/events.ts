import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { GlobalStream } from "../sse/global-stream";
import { heartbeat } from "../sse/sources/heartbeat";

export const eventsApi = new Hono().get("/", (ctx) =>
  streamSSE(ctx, (stream) => {
    const global = new GlobalStream(stream);
    global.attach(heartbeat(10_000));
    return global.done;
  })
);
