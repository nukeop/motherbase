import type { MessageEntry, MessagePart } from "@motherbase/core";
import type { ModelChunk } from "./model-chunk";

type DraftChunk = Exclude<ModelChunk, { type: "finish" }>;

export class MessageDraft {
  #parts: MessagePart[] = [];

  get parts(): readonly MessagePart[] {
    return this.#parts;
  }

  push(chunk: DraftChunk): void {
    switch (chunk.type) {
      case "text-start":
        this.#parts.push({ type: "text", text: "" });
        return;
      case "reasoning-start":
        this.#parts.push({ type: "reasoning", text: "" });
        return;
      case "text-delta":
        this.#extendOpenPart("text", chunk.text);
        return;
      case "reasoning-delta":
        this.#extendOpenPart("reasoning", chunk.text);
        return;
      case "tool-call":
        this.#parts.push({
          type: "tool-call",
          toolCallId: chunk.toolCallId,
          toolName: chunk.toolName,
          input: chunk.input,
        });
        return;
    }
  }

  #extendOpenPart(type: "text" | "reasoning", text: string): void {
    const open = this.#parts.at(-1);
    if (open?.type !== type) {
      throw new Error(`Received a ${type} delta without an open ${type} part`);
    }
    open.text += text;
  }

  complete(): MessageEntry {
    return { kind: "message", role: "assistant", parts: this.#parts };
  }
}
