import { z } from "zod";

// dollars per million tokens
type TokenPrice = number | null;

export type ModelPricing = {
  input: TokenPrice;
  output: TokenPrice;
  reasoning: TokenPrice;
};

export type ModelInfo = {
  id: string;
  name: string;
  pricing: ModelPricing;
  contextLength: number;
  maxOutputTokens: number;
  supportsTools: boolean;
  supportsReasoning: boolean;
};

export const modelInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  pricing: z
    .object({
      input: z.number().nullable().default(null),
      output: z.number().nullable().default(null),
      reasoning: z.number().nullable().default(null),
    })
    .default({ input: null, output: null, reasoning: null }),
  contextLength: z.number().default(128_000),
  maxOutputTokens: z.number().default(4096),
  supportsTools: z.boolean().default(false),
  supportsReasoning: z.boolean().default(false),
});
