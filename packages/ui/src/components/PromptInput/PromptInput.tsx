import type { ComboBoxItem } from "../ComboBox";
import { ComboBox } from "../ComboBox";
import { Select, type SelectItem } from "../Select";
import { MessageInput } from "./MessageInput";
import { type ModelData, ModelOption } from "./ModelOption";

type PromptInputProps = {
  providers: SelectItem[];
  models: ComboBoxItem<string, ModelData>[];
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onSubmit?: (text: string) => void;
};

export const PromptInput = ({
  providers,
  models,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  onSubmit,
}: PromptInputProps) => {
  return (
    <div className="flex flex-col bg-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <MessageInput onSubmit={onSubmit} />
      <div className="flex items-center gap-2 border-t border-orange/20 px-3 py-1.5">
        <Select
          value={selectedProvider}
          onChange={onProviderChange}
          options={providers}
        />
        <div className="h-3 w-px bg-cream/10" />
        <ComboBox
          value={selectedModel}
          onChange={onModelChange}
          options={models}
          placeholder="Search models..."
          renderOption={(item) => <ModelOption item={item} />}
        />
      </div>
    </div>
  );
};
