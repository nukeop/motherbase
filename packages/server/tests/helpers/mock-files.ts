const mockedFiles = new Map<string, string>();
const originalFile = Bun.file.bind(Bun);

const createMockBunFile = (content: string) => ({
  exists: () => Promise.resolve(true),
  json: () => Promise.resolve(JSON.parse(content)),
  text: () => Promise.resolve(content),
});

export const mockFile = (path: string, content: string) => {
  mockedFiles.set(path, content);
};

export const installFileMock = () => {
  // @ts-expect-error: overriding Bun.file for testing
  Bun.file = (path: string | URL, options?: BlobPropertyBag) => {
    const pathStr = String(path);
    if (mockedFiles.has(pathStr)) {
      return createMockBunFile(mockedFiles.get(pathStr)!);
    }
    return originalFile(path, options);
  };
};
