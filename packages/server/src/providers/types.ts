import type { ModelInfo } from "@motherbase/core";
import type { LanguageModel } from "ai";

export type Provider = {
  id: string;
  name: string;
  setCredential: (apiKey: string) => Promise<void>;
  listModels: () => Promise<ModelInfo[]>;
  createModel: (modelId: string) => Promise<LanguageModel>;
};
