import type { ReadFs } from "./fs";
import { streamChunks, streamLines } from "./streaming";

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
    | { reason: "lineLimit"; lastLine: number; nextOffset: number }
    | { reason: "byteLimit"; lastLine: number; nextOffset: number };
};

export type ReadResult = FileReadResult;

const DEFAULT_LIMIT = 500;
const MAX_LINE_LENGTH = 2000;
const MAX_OUTPUT_BYTES = 51200;

const truncateLine = (line: string): string => {
  if (line.length <= MAX_LINE_LENGTH) {
    return line;
  }
  return `${line.slice(0, MAX_LINE_LENGTH)}... (line truncated)`;
};

type Collected = Pick<FileReadResult, "lines" | "startLine" | "end">;

const collectWindow = async (
  lineStream: AsyncIterable<string>,
  startLine: number,
  limit: number,
): Promise<Collected> => {
  const lines: string[] = [];
  let bytes = 0;
  let lineNumber = 0;
  let stopReason: "lineLimit" | "byteLimit" | undefined;

  for await (const rawLine of lineStream) {
    lineNumber += 1;
    if (lineNumber < startLine) {
      continue;
    }
    if (lines.length === limit) {
      stopReason = "lineLimit";
      break;
    }
    const line = truncateLine(rawLine);
    const lineBytes = Buffer.byteLength(line);
    if (bytes + lineBytes > MAX_OUTPUT_BYTES) {
      stopReason = "byteLimit";
      break;
    }
    lines.push(line);
    bytes += lineBytes;
  }

  if (stopReason === undefined) {
    return { lines, startLine, end: { reason: "eof", totalLines: lineNumber } };
  }
  const lastLine = startLine + lines.length - 1;
  return {
    lines,
    startLine,
    end: { reason: stopReason, lastLine, nextOffset: lastLine + 1 },
  };
};

export const readPath = async (
  fs: ReadFs,
  path: string,
  window: ReadWindow,
): Promise<ReadResult> => {
  const collected = await collectWindow(
    streamLines(streamChunks(fs, path)),
    window.offset ?? 1,
    window.limit ?? DEFAULT_LIMIT,
  );
  return { type: "file", path, ...collected };
};
