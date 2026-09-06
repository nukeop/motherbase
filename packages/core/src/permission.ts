import { z } from "zod";

export const verbSchema = z.enum(["read", "write"]);
export type Verb = z.infer<typeof verbSchema>;

export const claimSchema = z.object({
  verb: verbSchema,
  path: z.string(),
});
export type Claim = z.infer<typeof claimSchema>;

export const permissionRequestSchema = z.object({
  id: z.string(),
  toolName: z.string(),
  claim: claimSchema,
});
export type PermissionRequest = z.infer<typeof permissionRequestSchema>;

export const decisionSchema = z.enum(["once", "always", "deny"]);
export type Decision = z.infer<typeof decisionSchema>;

export const permissionReplySchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("once") }),
  z.object({ decision: z.literal("always"), prefix: z.string() }),
  z.object({ decision: z.literal("deny") }),
]);
export type PermissionReply = z.infer<typeof permissionReplySchema>;

export const permissionRepliedSchema = z.object({
  requestId: z.string(),
  reply: permissionReplySchema,
});
export type PermissionReplied = z.infer<typeof permissionRepliedSchema>;

export const permissionOutcomeSchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("always"), granted: claimSchema }),
  z.object({ decision: z.literal("once"), granted: z.null() }),
  z.object({ decision: z.literal("deny"), granted: z.null() }),
]);
export type PermissionOutcome = z.infer<typeof permissionOutcomeSchema>;
