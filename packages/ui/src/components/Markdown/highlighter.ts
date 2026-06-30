import { createHighlighter, type Highlighter } from "shiki";

export const THEME = "everforest-dark";

const LANGUAGES = [
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "python",
  "rust",
  "go",
  "bash",
  "shell",
  "json",
  "yaml",
  "toml",
  "html",
  "css",
  "sql",
  "markdown",
  "diff",
];

export class HighlighterSingleton {
  #instance: Highlighter | null = null;

  get = async (): Promise<Highlighter> => {
    this.#instance ??= await createHighlighter({
      themes: [THEME],
      langs: LANGUAGES,
    });
    return this.#instance;
  };
}

export const highlighter = new HighlighterSingleton();
