import { jsonValueSchema, modelInfoSchema } from "@motherbase/core";
import { z } from "zod";
import { modelChunkSchema } from "../agent/model-chunk";

export const testProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  models: z.array(modelInfoSchema),
});

export const testScriptSchema = z.object({
  provider: z.string(),
  model: z.string(),
  chunks: z.array(modelChunkSchema),
  error: z.string().optional(),
});

export const testToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  behavior: z.enum(["success", "tool-error", "crash"]),
  output: jsonValueSchema.optional(),
  message: z.string().optional(),
});

export type TestTool = z.infer<typeof testToolSchema>;
