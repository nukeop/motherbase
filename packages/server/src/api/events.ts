import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

export const eventsApi = new Hono()
  .get("/", (ctx) => {
    return streamSSE(ctx, async () => {});
  });
