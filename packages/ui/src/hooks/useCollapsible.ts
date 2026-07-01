import { useEffect, useState } from "react";

export const useCollapsible = (autoExpand: boolean) => {
  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const isExpanded = autoExpand || manuallyExpanded;

  useEffect(() => {
    if (!autoExpand) {
      setManuallyExpanded(false);
    }
  }, [autoExpand]);

  const toggle = () => {
    if (!autoExpand) {
      setManuallyExpanded((prev) => !prev);
    }
  };

  return { isExpanded, toggle };
};
