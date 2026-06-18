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

export type { ModelInfo, ModelPricing } from "@motherbase/core";
export { readConfig } from "./config";
export type { Provider } from "./types";
