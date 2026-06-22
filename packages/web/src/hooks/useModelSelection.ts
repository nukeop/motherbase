import type { ComboBoxItem, ModelData, SelectItem } from "@motherbase/ui";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "../api/client";
import { useModels } from "./useModels";
import { useProviders } from "./useProviders";

type ServerState = {
  provider: string;
  model: string;
};

const STATE_KEY = ["serverState"];

const toSelectItems = <T extends { id: string; name: string }>(
  items: T[],
): SelectItem[] => items.map((item) => ({ label: item.name, value: item.id }));

export const useModelSelection = () => {
  const queryClient = useQueryClient();

  const { data: state } = useQuery({
    queryKey: STATE_KEY,
    queryFn: async () => {
      const response = await client.state.$get();
      return response.json() as Promise<ServerState>;
    },
  });

  const { mutate: setProvider } = useMutation({
    mutationFn: async (provider: string) => {
      const response = await client.state.provider.$post({
        json: { provider },
      });
      return response.json() as Promise<ServerState>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(STATE_KEY, data);
    },
  });

  const { mutate: setModel } = useMutation({
    mutationFn: async (model: string) => {
      const response = await client.state.model.$post({
        json: { model },
      });
      return response.json() as Promise<ServerState>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(STATE_KEY, data);
    },
  });

  const models: ComboBoxItem<string, ModelData>[] = (
    useModels(state?.provider ?? "").data ?? []
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
    selectedProvider: state?.provider ?? "",
    selectedModel: state?.model ?? "",
    onProviderChange: setProvider,
    onModelChange: setModel,
  };
};
