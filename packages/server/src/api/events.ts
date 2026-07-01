import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { EventStream } from "../sse/event-stream";
import { heartbeat } from "../sse/sources/heartbeat";

export const eventsApi = new Hono().get("/", (ctx) =>
  streamSSE(ctx, (stream) => new EventStream(stream, [heartbeat(10_000)]).done),
);
