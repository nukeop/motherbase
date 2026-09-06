import { z } from "zod";

export const createSessionSchema = z.object({
  directory: z.string().startsWith("/").optional(),
});

export const sessionParamsSchema = z.object({
  providerId: z.string().optional(),
  modelId: z.string().optional(),
});

export const sendMessageSchema = z.object({
  text: z.string().min(1),
});
