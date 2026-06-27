import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  createMockModel,
  createStream,
  toStreamParts,
} from "../../tests/helpers/mock-model";
import type { ModelChunk } from "../agent/model-chunk";
import { registerProvider } from "../providers";
import { testProviderSchema, testScriptSchema } from "./test-schemas";

let scriptedChunks: ModelChunk[] = [];
let scriptedError: string | undefined;

const buildStream = () => {
  const parts = toStreamParts(scriptedChunks);
  const error = scriptedError ? new Error(scriptedError) : undefined;
  return createStream(parts, error);
};

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
          createModel: async () => createMockModel(buildStream()),
        });
      }

      return ctx.json({ ok: true });
    },
  )
  .post(
    "/model",
    zValidator("json", testScriptSchema),
    (ctx) => {
      const body = ctx.req.valid("json");
      scriptedChunks = body.chunks;
      scriptedError = body.error;
      return ctx.json({ ok: true });
    },
  );
