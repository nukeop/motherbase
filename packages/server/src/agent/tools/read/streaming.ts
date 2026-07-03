import type { ReadFs } from "./fs";

const CHUNK_SIZE = 65536;

export async function* streamChunks(
  fs: ReadFs,
  path: string,
): AsyncGenerator<Uint8Array> {
  const handle = await fs.open(path, "r");
  try {
    let position = 0;
    while (true) {
      const buffer = Buffer.alloc(CHUNK_SIZE);
      const { bytesRead } = await handle.read(buffer, 0, CHUNK_SIZE, position);
      if (bytesRead === 0) {
        return;
      }
      position += bytesRead;
      yield buffer.subarray(0, bytesRead);
    }
  } finally {
    await handle.close();
  }
}

export async function* streamLines(
  chunks: AsyncIterable<Uint8Array>,
): AsyncGenerator<string> {
  const decoder = new TextDecoder("utf-8");
  let carry = "";
  for await (const chunk of chunks) {
    carry += decoder.decode(chunk, { stream: true });
    const parts = carry.split("\n");
    carry = parts.pop() ?? "";
    yield* parts;
  }
  carry += decoder.decode();
  if (carry !== "") {
    yield carry;
  }
}
