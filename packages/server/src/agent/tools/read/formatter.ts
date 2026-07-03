import type { FileReadResult, ReadResult } from "./reader";

export type ReadFormatter = (result: ReadResult) => string;

const numberLines = (result: FileReadResult): string[] =>
  result.lines.map((line, i) => `${result.startLine + i}: ${line}`);

const footer = (result: FileReadResult): string => {
  const { end } = result;
  if (end.reason === "eof") {
    return `(End of file - total ${end.totalLines} lines)`;
  }
  return `(Showing lines ${result.startLine}-${end.lastLine}. More lines exist. Use offset=${end.nextOffset} to continue.)`;
};

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
