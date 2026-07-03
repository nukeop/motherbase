import { ToolError } from "../definition";
import { isNotFound, notFoundError } from "./errors";
import type { ReadDirent, ReadFs, ReadStats } from "./fs";
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

export type DirectoryReadResult = {
  type: "directory";
  path: string;
  entries: string[];
  startIndex: number;
  total: number;
};

export type ReadResult = FileReadResult | DirectoryReadResult;

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

async function* assertText(
  chunks: AsyncIterable<Uint8Array>,
  path: string,
): AsyncGenerator<Uint8Array> {
  let first = true;
  for await (const chunk of chunks) {
    if (first && chunk.includes(0)) {
      throw new ToolError(`Cannot read binary file: ${path}`);
    }
    first = false;
    yield chunk;
  }
}

const assertOffsetInRange = (
  offset: number | undefined,
  total: number,
  unit: string,
): void => {
  if (offset !== undefined && offset > Math.max(total, 1)) {
    throw new ToolError(`Offset ${offset} is out of range (${total} ${unit})`);
  }
};

const readFile = async (
  fs: ReadFs,
  path: string,
  window: ReadWindow,
): Promise<FileReadResult> => {
  const collected = await collectWindow(
    streamLines(assertText(streamChunks(fs, path), path)),
    window.offset ?? 1,
    window.limit ?? DEFAULT_LIMIT,
  );
  if (collected.end.reason === "eof") {
    assertOffsetInRange(window.offset, collected.end.totalLines, "lines");
  }
  return { type: "file", path, ...collected };
};

const toEntryName = (dirent: ReadDirent): string => {
  if (dirent.isDirectory()) {
    return `${dirent.name}/`;
  }
  return dirent.name;
};

const readDirectory = async (
  fs: ReadFs,
  path: string,
  window: ReadWindow,
): Promise<DirectoryReadResult> => {
  const dirents = await fs.readdir(path, { withFileTypes: true });
  const names = dirents.map(toEntryName).sort();
  assertOffsetInRange(window.offset, names.length, "entries");
  const startIndex = window.offset ?? 1;
  const limit = window.limit ?? DEFAULT_LIMIT;
  const entries = names.slice(startIndex - 1, startIndex - 1 + limit);
  return { type: "directory", path, entries, startIndex, total: names.length };
};

const statOrExplain = async (fs: ReadFs, path: string): Promise<ReadStats> => {
  try {
    return await fs.stat(path);
  } catch (error) {
    if (isNotFound(error)) {
      throw await notFoundError(fs, path);
    }
    throw error;
  }
};

export const readPath = async (
  fs: ReadFs,
  path: string,
  window: ReadWindow,
): Promise<ReadResult> => {
  const stats = await statOrExplain(fs, path);
  if (stats.isDirectory()) {
    return readDirectory(fs, path, window);
  }
  return readFile(fs, path, window);
};
