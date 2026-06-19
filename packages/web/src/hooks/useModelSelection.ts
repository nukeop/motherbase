import type { ComboBoxItem, ModelData, SelectItem } from "@motherbase/ui";
import { useModels } from "./useModels";
import { useProviders } from "./useProviders";
import { useServerState, useSetModel, useSetProvider } from "./useServerState";

const toSelectItems = <T extends { id: string; name: string }>(
  items: T[],
): SelectItem[] => items.map((item) => ({ label: item.name, value: item.id }));

export const useModelSelection = () => {
  const { data: state } = useServerState();
  const { mutate: setProvider } = useSetProvider();
  const { mutate: setModel } = useSetModel();

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
