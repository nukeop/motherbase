import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { readConfig } from "../providers/config";

let currentProvider = "";
let currentModel = "";

const loadDefaults = async () => {
  if (!currentProvider) {
    const config = await readConfig();
    currentProvider = config.provider;
  }
};

export const stateApi = new Hono()
  .get("/", async (ctx) => {
    await loadDefaults();
    return ctx.json({
      provider: currentProvider,
      model: currentModel,
    });
  })
  .post(
    "/provider",
    zValidator("json", z.object({ provider: z.string() })),
    (ctx) => {
      const { provider } = ctx.req.valid("json");
      currentProvider = provider;
      currentModel = "";
      return ctx.json({ provider: currentProvider, model: currentModel });
    },
  )
  .post(
    "/model",
    zValidator("json", z.object({ model: z.string() })),
    (ctx) => {
      const { model } = ctx.req.valid("json");
      currentModel = model;
      return ctx.json({ provider: currentProvider, model: currentModel });
    },
  );
