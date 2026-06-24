import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const modelChunkSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text-delta"), text: z.string() }),
  z.object({ type: z.literal("reasoning-delta"), text: z.string() }),
  z.object({ type: z.literal("finish"), reason: z.literal("stop") }),
]);

export const testApi = new Hono().post(
  "/script",
  zValidator("json", z.object({ chunks: z.array(modelChunkSchema) })),
  (ctx) => {
    // TODO: store chunks for the test provider to use
    return ctx.json({ ok: true });
  },
);
