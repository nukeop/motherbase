import { type ReadToolInput, readToolInputSchema } from "@motherbase/core";
import type { ToolDefinition } from "../definition";
import { type ReadFormatter, xmlFormatter } from "./formatter";
import type { ReadFs } from "./fs";
import { prompt } from "./prompt";
import { readPath } from "./reader";

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
  inputSchema: readToolInputSchema,
  execute: async (raw) => {
    const input = raw as ReadToolInput;
    const result = await readPath(fs, input.filePath, {
      offset: input.offset,
      limit: input.limit,
    });
    return formatter(result);
  },
});
