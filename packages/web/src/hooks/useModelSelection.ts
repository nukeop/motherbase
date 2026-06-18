import type { SelectItem } from "@motherbase/ui";
import { useState } from "react";

const providers: SelectItem[] = [];
const models: SelectItem[] = [];

export const useModelSelection = () => {
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");

  return {
    providers,
    models,
    selectedProvider: provider,
    selectedModel: model,
    onProviderChange: setProvider,
    onModelChange: setModel,
  };
};
