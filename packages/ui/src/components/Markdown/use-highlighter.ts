import { useEffect, useState } from "react";
import type { Highlighter } from "shiki";
import { highlighter } from "./highlighter";

export const useHighlighter = (): Highlighter | null => {
  const [instance, setInstance] = useState<Highlighter | null>(null);

  useEffect(() => {
    highlighter.get().then(setInstance);
  }, []);

  return instance;
};
