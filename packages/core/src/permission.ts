import { z } from "zod";

export const permissionRequestSchema = z.object({
  id: z.string(),
  toolName: z.string(),
  path: z.string(),
});

export type PermissionRequest = z.infer<typeof permissionRequestSchema>;

export const permissionReplySchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("once") }),
  z.object({ decision: z.literal("always"), prefix: z.string() }),
  z.object({ decision: z.literal("deny") }),
]);

export type PermissionReply = z.infer<typeof permissionReplySchema>;
