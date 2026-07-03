import { isAbsolute } from "node:path";
import { z } from "zod";

export const inputSchema = z.object({
  filePath: z.string().refine(isAbsolute, "Path must be absolute"),
  offset: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});

export type ReadInput = z.infer<typeof inputSchema>;
