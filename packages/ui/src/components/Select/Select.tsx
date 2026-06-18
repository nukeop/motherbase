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
        className="group flex cursor-pointer items-center gap-1.5 bg-linear-to-b from-steel to-gunmetal px-2.5 py-1 font-nav text-[11px] tracking-widest text-cream/80 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.3)] outline-none transition-colors hover:text-cream group-data-open:text-orange"
      >
        {selected?.label ?? placeholder}
        <LuChevronDown className="ml-auto size-3 text-cream/40 transition-transform duration-150 group-data-open:rotate-180 group-data-open:text-orange" />
      </ListboxButton>
      <ListboxOptions
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-50 overflow-y-auto border border-cream/5 bg-gunmetal font-nav text-[11px] tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] outline-none"
      >
        {options.map((option) => (
          <ListboxOption
            key={option.value}
            value={option.value}
            className="cursor-pointer border-l-2 border-transparent px-3 py-1.5 text-cream/60 uppercase transition-colors data-focus:border-orange/50 data-focus:bg-orange/10 data-focus:text-cream data-selected:border-orange data-selected:text-orange"
          >
            {option.label}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
