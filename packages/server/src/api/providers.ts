import { Hono } from "hono";
import { allProviders, getProvider } from "../providers";

export const providersApi = new Hono()
  .get("/", (ctx) => {
    const providers = allProviders().map((provider) => ({
      id: provider.id,
      name: provider.name,
    }));
    return ctx.json(providers);
  })
  .get("/:id/models", async (ctx) => {
    const provider = getProvider(ctx.req.param("id"));
    const models = await provider.listModels();
    return ctx.json(models);
  });
