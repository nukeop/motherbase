import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createMockModel } from "../../tests/helpers/mock-model";
import type { ModelChunk } from "../agent/model-chunk";
import { registerProvider } from "../providers";
import { testProviderSchema, testScriptSchema } from "./test-schemas";

let scriptedChunks: ModelChunk[] = [];

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
          setCredential: async () => { },
          removeCredential: async () => { },
          listModels: async () => models,
          createModel: async () => createMockModel(scriptedChunks),
        });
      }

      return ctx.json({ ok: true });
    },
  )
  .post(
    "/model",
    zValidator("json", testScriptSchema),
    (ctx) => {
      scriptedChunks = ctx.req.valid("json").chunks;
      return ctx.json({ ok: true });
    },
  );
