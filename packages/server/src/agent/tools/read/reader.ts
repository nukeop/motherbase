export type ReadFs = {
  readFile(path: string, encoding: BufferEncoding): Promise<string | Buffer>;
};

export type ReadWindow = {
  offset?: number;
  limit?: number;
};

export type FileReadResult = {
  type: "file";
  path: string;
  lines: string[];
  startLine: number;
  end:
    | { reason: "eof"; totalLines: number }
    | { reason: "lineLimit"; lastLine: number; nextOffset: number };
};

export type ReadResult = FileReadResult;

const toLines = (content: string): string[] => {
  const text = content.endsWith("\n") ? content.slice(0, -1) : content;
  return text.split("\n");
};

const sliceWindow = (
  lines: string[],
  startLine: number,
  limit?: number,
): string[] => {
  if (limit === undefined) {
    return lines.slice(startLine - 1);
  }
  return lines.slice(startLine - 1, startLine - 1 + limit);
};

const windowEnd = (
  startLine: number,
  shownCount: number,
  totalLines: number,
): FileReadResult["end"] => {
  const lastLine = startLine + shownCount - 1;
  if (lastLine < totalLines) {
    return { reason: "lineLimit", lastLine, nextOffset: lastLine + 1 };
  }
  return { reason: "eof", totalLines };
};

export const readPath = async (
  fs: ReadFs,
  path: string,
  window: ReadWindow,
): Promise<ReadResult> => {
  const content = await fs.readFile(path, "utf8");
  const allLines = toLines(content.toString());
  const startLine = window.offset ?? 1;
  const lines = sliceWindow(allLines, startLine, window.limit);
  return {
    type: "file",
    path,
    lines,
    startLine,
    end: windowEnd(startLine, lines.length, allLines.length),
  };
};
