export type FinishReason = "stop";

export type ModelChunk =
  | { type: "text-delta"; text: string }
  | { type: "reasoning-delta"; text: string }
  | { type: "finish"; reason: FinishReason };
