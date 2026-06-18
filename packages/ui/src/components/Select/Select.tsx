import {
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
} from "@floating-ui/react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { LuChevronDown } from "react-icons/lu";

export type SelectItem<T extends string = string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string = string> = {
  value: T;
  onChange: (value: T) => void;
  options: SelectItem<T>[];
  placeholder?: string;
};

export const Select = <T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: SelectProps<T>) => {
  const selected = options.find((o) => o.value === value);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip(),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.min(availableHeight - 8, 300)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        ref={refs.setReference}
        className="group flex cursor-pointer items-center gap-1 border border-ink/20 bg-cream px-2 py-1 font-nav text-xs tracking-wide text-ink uppercase outline-none"
      >
        {selected?.label ?? placeholder}
        <LuChevronDown className="size-3 transition-transform duration-150 group-data-open:rotate-180" />
      </ListboxButton>
      <ListboxOptions
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-50 overflow-y-auto border border-ink/20 bg-cream font-nav text-xs tracking-wide shadow-[2px_2px_0_rgba(0,0,0,0.15)] outline-none"
      >
        {options.map((option) => (
          <ListboxOption
            key={option.value}
            value={option.value}
            className="cursor-pointer px-3 py-1.5 text-ink uppercase data-focus:bg-linear-to-r data-focus:from-blue/20 data-focus:to-blue/5 data-selected:border-l-2 data-selected:border-blue data-selected:bg-linear-to-r data-selected:from-blue/15 data-selected:to-transparent data-selected:font-bold"
          >
            {option.label}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
