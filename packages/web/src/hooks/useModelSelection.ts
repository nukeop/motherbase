import type { SelectItem } from "@motherbase/ui";
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

  return {
    providers: toSelectItems(useProviders().data ?? []),
    models: toSelectItems(useModels(state?.provider ?? "").data ?? []),
    selectedProvider: state?.provider ?? "",
    selectedModel: state?.model ?? "",
    onProviderChange: setProvider,
    onModelChange: setModel,
  };
};
