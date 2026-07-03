export type ReadFs = {
  readFile(path: string, encoding: BufferEncoding): Promise<string | Buffer>;
};

export type FileReadResult = {
  type: "file";
  path: string;
  lines: string[];
  startLine: number;
  end: { reason: "eof"; totalLines: number };
};

export type ReadResult = FileReadResult;

const toLines = (content: string): string[] => {
  const text = content.endsWith("\n") ? content.slice(0, -1) : content;
  return text.split("\n");
};

export const readPath = async (
  fs: ReadFs,
  path: string,
): Promise<ReadResult> => {
  const content = await fs.readFile(path, "utf8");
  const lines = toLines(content.toString());
  return {
    type: "file",
    path,
    lines,
    startLine: 1,
    end: { reason: "eof", totalLines: lines.length },
  };
};
