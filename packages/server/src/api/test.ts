import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createMockModel } from "../../tests/helpers/mock-model";
import { TestScripts } from "../../tests/helpers/test-scripts";
import { registerProvider } from "../providers";
import { testProviderSchema, testScriptSchema } from "./test-schemas";

const scripts = new TestScripts();

export const testApi = new Hono()
  .post(
    "/providers",
    zValidator("json", z.object({ providers: z.array(testProviderSchema) })),
    (ctx) => {
      const { providers } = ctx.req.valid("json");

      for (const provider of providers) {
        const models = provider.models;
        registerProvider({
          id: provider.id,
          name: provider.name,
          setCredential: async () => {},
          removeCredential: async () => {},
          listModels: async () => models,
          createModel: async (modelId) =>
            createMockModel(scripts.buildStream(provider.id, modelId)),
        });
      }

      return ctx.json({ ok: true });
    },
  )
  .post(
    "/model",
    zValidator("json", testScriptSchema),
    (ctx) => {
      const { provider, model, chunks, error } = ctx.req.valid("json");
      scripts.set(provider, model, { chunks, error });
      return ctx.json({ ok: true });
    },
  );
