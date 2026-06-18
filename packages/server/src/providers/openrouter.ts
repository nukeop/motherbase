import { getLogger } from "@logtape/logtape";
import type { ModelInfo } from "@motherbase/core";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { Provider } from "./types";

const logger = getLogger(["Motherbase", "Providers", "OpenRouter"]);

const SERVICE = "motherbase";
const SECRET_NAME = "openrouter";

const toMillionTokenPrice = (value: string | undefined): number | null =>
  value ? parseFloat(value) * 1_000_000 : null;

type OpenRouterModel = {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
    internal_reasoning?: string;
  };
  context_length: number;
  top_provider: { max_completion_tokens: number };
  supported_parameters: string[];
};

const toModelInfo = (model: OpenRouterModel): ModelInfo => ({
  id: model.id,
  name: model.name,
  pricing: {
    input: toMillionTokenPrice(model.pricing.prompt),
    output: toMillionTokenPrice(model.pricing.completion),
    reasoning: toMillionTokenPrice(model.pricing.internal_reasoning),
  },
  contextLength: model.context_length,
  maxOutputTokens: model.top_provider.max_completion_tokens,
  supportsTools: model.supported_parameters.includes("tools"),
  supportsReasoning: model.supported_parameters.includes("reasoning"),
});

export const setCredential = async (apiKey: string) => {
  await Bun.secrets.set({
    service: SERVICE,
    name: SECRET_NAME,
    value: apiKey,
  });
};

export const removeCredential = async () => {
  await Bun.secrets.delete({
    service: SERVICE,
    name: SECRET_NAME,
  });
};

const getApiKey = async (): Promise<string> => {
  const key = await Bun.secrets.get({
    service: SERVICE,
    name: SECRET_NAME,
  });
  if (!key) {
    throw new Error(
      "No OpenRouter API key found. Run `motherbase providers connect` first.",
    );
  }
  return key;
};

export const listModels = async (): Promise<ModelInfo[]> => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/models?supported_parameters=tools",
  );
  const { data } = (await response.json()) as { data: OpenRouterModel[] };
  return data.map(toModelInfo);
};

export const createModel = async (modelId: string) => {
  const key = await getApiKey();
  return createOpenRouter({ apiKey: key }).chat(modelId);
};

export const openrouter: Provider = {
  id: "openrouter",
  name: "OpenRouter",
  setCredential,
  removeCredential,
  listModels,
  createModel,
};
