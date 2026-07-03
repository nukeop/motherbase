export type ReadFileHandle = {
  read(
    buffer: Buffer,
    offset: number,
    length: number,
    position: number,
  ): Promise<{ bytesRead: number }>;
  close(): Promise<void>;
};

export type ReadFs = {
  open(path: string, flags: string): Promise<ReadFileHandle>;
};
