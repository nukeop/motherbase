import { z } from "zod";

const isAbsolutePath = (path: string): boolean => {
  return path.startsWith("/");
};

export const readToolInputSchema = z.object({
  filePath: z.string().refine(isAbsolutePath, "Path must be absolute"),
  offset: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});

export type ReadToolInput = z.infer<typeof readToolInputSchema>;

export type ReadToolOutput = string;
