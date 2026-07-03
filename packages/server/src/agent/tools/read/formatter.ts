import type { FileReadResult, ReadResult } from "./reader";

export type ReadFormatter = (result: ReadResult) => string;

const numberLines = (result: FileReadResult): string[] =>
  result.lines.map((line, i) => `${result.startLine + i}: ${line}`);

const footer = (result: FileReadResult): string =>
  `(End of file - total ${result.end.totalLines} lines)`;

export const xmlFormatter: ReadFormatter = (result) => {
  return [
    `<path>${result.path}</path>`,
    `<type>${result.type}</type>`,
    "<content>",
    ...numberLines(result),
    footer(result),
    "</content>",
  ].join("\n");
};
