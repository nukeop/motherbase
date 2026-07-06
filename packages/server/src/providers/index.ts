import { openrouter } from "./openrouter";
import type { Provider } from "./types";

const providers: Record<string, Provider> = {
  openrouter,
};

export const allProviders = (): Provider[] => Object.values(providers);

export const getProvider = (id: string): Provider => {
  const provider = providers[id];
  if (!provider) {
    throw new Error(`Unknown provider: ${id}`);
  }
  return provider;
};

export const registerProvider = (provider: Provider): void => {
  providers[provider.id] = provider;
};

export type { ModelInfo, ModelPricing } from "@motherbase/core";
export { createCheapModel } from "./cheap";
export { readConfig } from "./config";
export type { Provider } from "./types";
