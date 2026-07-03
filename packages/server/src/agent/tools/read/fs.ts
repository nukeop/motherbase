export type ReadFileHandle = {
  read(
    buffer: Buffer,
    offset: number,
    length: number,
    position: number,
  ): Promise<{ bytesRead: number }>;
  close(): Promise<void>;
};

export type ReadStats = {
  isDirectory(): boolean;
};

export type ReadDirent = {
  name: string;
  isDirectory(): boolean;
};

export type ReadFs = {
  open(path: string, flags: string): Promise<ReadFileHandle>;
  stat(path: string): Promise<ReadStats>;
  readdir(
    path: string,
    options: { withFileTypes: true },
  ): Promise<ReadDirent[]>;
};
