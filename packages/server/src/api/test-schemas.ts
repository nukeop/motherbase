import { modelInfoSchema } from "@motherbase/core";
import { z } from "zod";
import { modelChunkSchema } from "../agent/model-chunk";

export const testProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  models: z.array(modelInfoSchema),
});

export const testScriptSchema = z.object({
  chunks: z.array(modelChunkSchema),
  error: z.string().optional(),
});
