import { z } from "zod";

export const inputSchema = z.object({
  filePath: z.string(),
  offset: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});

export type ReadInput = z.infer<typeof inputSchema>;
