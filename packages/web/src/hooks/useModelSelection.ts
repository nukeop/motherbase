import type { ComboBoxItem, ModelData, SelectItem } from "@motherbase/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";
import { sessionKey } from "./query-keys";
import { useModels } from "./useModels";
import { useProviders } from "./useProviders";

const toSelectItems = <T extends { id: string; name: string }>(
  items: T[],
): SelectItem[] => items.map((item) => ({ label: item.name, value: item.id }));

export const useModelSelection = (
  sessionId: string,
  providerId: string,
  modelId: string,
) => {
  const queryClient = useQueryClient();

  const { mutate: setProvider } = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await client.sessions[":id"].$patch({
        param: { id: sessionId },
        json: { providerId },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
    },
  });

  const { mutate: setModel } = useMutation({
    mutationFn: async (modelId: string) => {
      const response = await client.sessions[":id"].$patch({
        param: { id: sessionId },
        json: { modelId },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
    },
  });

  const models: ComboBoxItem<string, ModelData>[] = (
    useModels(providerId).data ?? []
  ).map((model) => ({
    label: model.name,
    value: model.id,
    data: {
      inputPrice: model.pricing.input,
      outputPrice: model.pricing.output,
      contextLength: model.contextLength,
    },
  }));

  return {
    providers: toSelectItems(useProviders().data ?? []),
    models,
    selectedProvider: providerId,
    selectedModel: modelId,
    onProviderChange: setProvider,
    onModelChange: setModel,
  };
};
