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

type UseComboBoxReturn<T extends string> = {
  query: string;
  setQuery: (query: string) => void;
  filtered: ComboBoxItem<T>[];
  selected: ComboBoxItem<T> | undefined;
  refs: UseFloatingReturn["refs"];
  floatingStyles: React.CSSProperties;
};

export const useComboBox = <T extends string>(
  options: ComboBoxItem<T>[],
  value: T,
): UseComboBoxReturn<T> => {
  const [query, setQuery] = useState("");

  const filtered = query
    ? options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      )
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
