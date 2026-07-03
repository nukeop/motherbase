import { basename, dirname } from "node:path";
import { ToolError } from "../definition";
import type { ReadFs } from "./fs";

const MAX_SUGGESTIONS = 3;

export const isNotFound = (error: unknown): boolean =>
  error instanceof Error && "code" in error && error.code === "ENOENT";

export const notFoundError = async (
  fs: ReadFs,
  path: string,
): Promise<ToolError> => {
  const suggestions = await similarSiblings(fs, path);
  return new ToolError(notFoundMessage(path, suggestions));
};

const notFoundMessage = (path: string, suggestions: string[]): string => {
  if (suggestions.length === 0) {
    return `File not found: ${path}`;
  }
  return [
    `File not found: ${path}`,
    "Did you mean one of these?",
    ...suggestions.map((name) => `- ${name}`),
  ].join("\n");
};

const similarSiblings = async (fs: ReadFs, path: string): Promise<string[]> => {
  const target = basename(path).toLowerCase();
  const siblings = await entryNames(fs, dirname(path));
  return siblings
    .filter((name) => isSimilar(name, target))
    .sort()
    .slice(0, MAX_SUGGESTIONS);
};

const isSimilar = (name: string, target: string): boolean => {
  const candidate = name.toLowerCase();
  return candidate.includes(target) || target.includes(candidate);
};

const entryNames = async (fs: ReadFs, dir: string): Promise<string[]> => {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    return dirents.map((dirent) => dirent.name);
  } catch {
    return [];
  }
};
