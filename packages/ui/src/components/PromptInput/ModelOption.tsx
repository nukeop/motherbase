import { formatContext, formatPrice } from "../../format";
import type { ComboBoxItem } from "../ComboBox";

export type ModelData = {
  inputPrice: number | null;
  outputPrice: number | null;
  contextLength: number;
};

export const ModelOption = ({
  item,
}: {
  item: ComboBoxItem<string, ModelData>;
}) => {
  const pricing =
    item.data !== undefined
      ? `${formatPrice(item.data.inputPrice)} / ${formatPrice(item.data.outputPrice)} · ${formatContext(item.data.contextLength)}`
      : null;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-nav text-[11px] tracking-widest uppercase">
        {item.label}
      </span>
      {pricing !== null && (
        <span className="font-nav text-[10px] tracking-widest text-cream/40">
          {pricing}
        </span>
      )}
    </div>
  );
};
