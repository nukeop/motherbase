import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import type { ReactNode } from "react";
import { cn } from "../../utils";
import { useComboBox } from "./useComboBox";

export type ComboBoxItem<T extends string = string, D = undefined> = {
  label: string;
  value: T;
  data?: D;
};

type ComboBoxProps<T extends string = string, D = undefined> = {
  value: T;
  onChange: (value: T) => void;
  options: ComboBoxItem<T, D>[];
  placeholder?: string;
  renderOption?: (
    item: ComboBoxItem<T, D>,
    active: boolean,
    selected: boolean,
  ) => ReactNode;
};

export const ComboBox = <T extends string = string, D = undefined>({
  value,
  onChange,
  options,
  placeholder = "Search...",
  renderOption,
}: ComboBoxProps<T, D>) => {
  const { setQuery, filtered, selected, refs, floatingStyles } = useComboBox(
    options,
    value,
  );

  return (
    <Combobox
      value={value}
      onChange={(val) => {
        if (val !== null) {
          onChange(val);
        }
      }}
      onClose={() => setQuery("")}
      immediate
    >
      <ComboboxButton ref={refs.setReference} className="flex w-full">
        <ComboboxInput
          displayValue={() => selected?.label ?? ""}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={(event) => event.target.select()}
          placeholder={placeholder}
          className="w-full bg-linear-to-b from-steel to-gunmetal px-2.5 py-1 font-nav text-[11px] tracking-widest text-cream/80 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.3)] outline-none placeholder:text-cream/30"
        />
      </ComboboxButton>
      <ComboboxOptions
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-50 overflow-y-auto border border-cream/5 bg-gunmetal font-nav text-[11px] tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] outline-none empty:hidden"
      >
        {filtered.map((option) => (
          <ComboboxOption key={option.value} value={option.value}>
            {({ focus, selected: isSelected }) => (
              <div
                className={cn(
                  "cursor-pointer border-l-2 px-3 py-1.5 transition-colors",
                  {
                    "border-orange text-orange": isSelected,
                    "border-orange/50 bg-orange/10 text-cream":
                      focus && !isSelected,
                    "border-transparent text-cream/60": !focus && !isSelected,
                  },
                )}
              >
                {renderOption ? (
                  renderOption(option, focus, isSelected)
                ) : (
                  <span className="uppercase">{option.label}</span>
                )}
              </div>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};
