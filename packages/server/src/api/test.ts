import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { toToolDefinition } from "../../tests/fixtures/test-tools";
import { TestScripts } from "../../tests/harness/test-scripts";
import { installFileMock, mockFile } from "../../tests/mocks/mock-files";
import { createMockModel } from "../../tests/mocks/mock-model";
import { registerTool } from "../agent/tools/registry";
import { configPath } from "../paths";
import { registerProvider } from "../providers";
import { configSchema } from "../providers/config";
import {
  testProviderSchema,
  testScriptSchema,
  testToolSchema,
} from "./test-schemas";

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
            createMockModel(() => scripts.buildStream(provider.id, modelId)),
        });
      }

      return ctx.json({ ok: true });
    },
  )
  .post("/model", zValidator("json", testScriptSchema), (ctx) => {
    const { provider, model, chunks, error } = ctx.req.valid("json");
    scripts.enqueue(provider, model, { chunks, error });
    return ctx.json({ ok: true });
  })
  .post(
    "/tools",
    zValidator("json", z.object({ tools: z.array(testToolSchema) })),
    (ctx) => {
      const { tools } = ctx.req.valid("json");
      for (const tool of tools) {
        registerTool(toToolDefinition(tool));
      }
      return ctx.json({ ok: true });
    },
  )
  .post("/config", zValidator("json", configSchema), (ctx) => {
    installFileMock();
    const config = ctx.req.valid("json");
    mockFile(configPath, JSON.stringify(config));
    return ctx.json({ ok: true });
  });
