import type { DirectoryReadResult, FileReadResult, ReadResult } from "./reader";

export type ReadFormatter = (result: ReadResult) => string;

const numberLines = (result: FileReadResult): string[] =>
  result.lines.map((line, i) => `${result.startLine + i}: ${line}`);

const fileFooter = (result: FileReadResult): string => {
  const { end } = result;
  switch (end.reason) {
    case "eof":
      return `(End of file - total ${end.totalLines} lines)`;
    case "lineLimit":
      return `(Showing lines ${result.startLine}-${end.lastLine}. More lines exist. Use offset=${end.nextOffset} to continue.)`;
    case "byteLimit":
      return `(Output capped at 50 KB. Showing lines ${result.startLine}-${end.lastLine}. Use offset=${end.nextOffset} to continue.)`;
  }
};

const directoryFooter = (result: DirectoryReadResult): string => {
  const lastIndex = result.startIndex + result.entries.length - 1;
  const coversAll = result.startIndex === 1 && lastIndex === result.total;
  if (coversAll) {
    return `(Directory - total ${result.total} entries)`;
  }
  return `(Showing entries ${result.startIndex}-${lastIndex} of ${result.total}. Use offset=${lastIndex + 1} to continue.)`;
};

const body = (result: ReadResult): string[] => {
  if (result.type === "file") {
    return [...numberLines(result), fileFooter(result)];
  }
  return [...result.entries, directoryFooter(result)];
};

export const xmlFormatter: ReadFormatter = (result) =>
  [
    `<path>${result.path}</path>`,
    `<type>${result.type}</type>`,
    "<content>",
    ...body(result),
    "</content>",
  ].join("\n");
