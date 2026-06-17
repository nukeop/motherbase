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
