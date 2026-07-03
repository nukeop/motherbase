const isBlank = (line: string): boolean => line.trim() === "";

const trimBlankEdges = (lines: string[]): string[] => {
  const start = lines.findIndex((line) => !isBlank(line));
  const end = lines.findLastIndex((line) => !isBlank(line));
  return lines.slice(start, end + 1);
};

export const dedent = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): string => {
  const raw = String.raw({ raw: strings }, ...values);
  const lines = trimBlankEdges(raw.split("\n"));
  const indents = lines
    .filter((line) => !isBlank(line))
    .map((line) => line.length - line.trimStart().length);
  const indent = Math.min(...indents);
  return lines.map((line) => line.slice(indent)).join("\n");
};
