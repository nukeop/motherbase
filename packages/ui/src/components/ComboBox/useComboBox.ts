import {
  autoUpdate,
  flip,
  offset,
  size,
  type UseFloatingReturn,
  useFloating,
} from "@floating-ui/react";
import { useState } from "react";
import type { ComboBoxItem } from "./ComboBox";

type UseComboBoxReturn<T extends string, D = undefined> = {
  query: string;
  setQuery: (query: string) => void;
  filtered: ComboBoxItem<T, D>[];
  selected: ComboBoxItem<T, D> | undefined;
  refs: UseFloatingReturn["refs"];
  floatingStyles: React.CSSProperties;
};

export const useComboBox = <T extends string, D = undefined>(
  options: ComboBoxItem<T, D>[],
  value: T,
): UseComboBoxReturn<T, D> => {
  const [query, setQuery] = useState("");

  const filtered = query
    ? options.filter((option) => {
      const lowercaseQuery = query.toLowerCase();
      return (
        option.label.toLowerCase().includes(lowercaseQuery) ||
        option.value.toLowerCase().includes(lowercaseQuery)
      );
    })
    : options;

  const selected = options.find((option) => option.value === value);

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

  return {
    query,
    setQuery,
    filtered,
    selected,
    refs,
    floatingStyles,
  };
};
