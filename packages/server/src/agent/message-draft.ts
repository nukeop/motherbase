import { getLogger } from "@logtape/logtape";
import type { MessageEntry, MessagePart } from "@motherbase/core";
import type { ModelChunk } from "./model-chunk";

const logger = getLogger(["Motherbase", "Agent", "MessageDraft"]);

const partTypeByDelta = {
  "text-delta": "text",
  "reasoning-delta": "reasoning",
} as const;

type DeltaChunk = Extract<ModelChunk, { type: keyof typeof partTypeByDelta }>;

export class MessageDraft {
  #parts: MessagePart[] = [];

  get parts(): readonly MessagePart[] {
    return this.#parts;
  }

  push(delta: DeltaChunk): void {
    const type = partTypeByDelta[delta.type];
    const last = this.#parts.at(-1);
    if (last?.type === type) {
      last.text += delta.text;
      return;
    }
    this.#parts.push({ type, text: delta.text });
  }

  complete(): MessageEntry {
    return { kind: "message", role: "assistant", parts: this.#parts };
  }
}
