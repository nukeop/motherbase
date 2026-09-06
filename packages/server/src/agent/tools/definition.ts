import type { Claim, JsonValue } from "@motherbase/core";
import type { z } from "zod";

export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: z.ZodType;
  claim?: (input: unknown) => Claim;
  execute: (input: unknown) => Promise<JsonValue>;
};

export class ToolError extends Error {}
