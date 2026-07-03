import type { ToolDefinition } from "../definition";
import { type ReadFormatter, xmlFormatter } from "./formatter";
import { prompt } from "./prompt";
import { type ReadFs, readPath } from "./reader";
import { inputSchema, type ReadInput } from "./schema";

type Deps = {
  fs: ReadFs;
  formatter?: ReadFormatter;
};

export const createReadTool = ({
  fs,
  formatter = xmlFormatter,
}: Deps): ToolDefinition => ({
  name: "read",
  description: prompt,
  inputSchema,
  execute: async (raw) => {
    const input = raw as ReadInput;
    const result = await readPath(fs, input.filePath);
    return formatter(result);
  },
});
