import { describe, expect, test } from "bun:test";
import type { MessageEntry } from "@motherbase/core";
import { Scenario } from "../helpers/scenario";

describe("text reply turn", () => {
  test("a sent message streams back a text reply and the session returns to idle", async () => {
    const scenario = new Scenario();

    scenario.scriptTurn([
      { type: "text-start" },
      { type: "text-delta", text: "Hi" },
      { type: "text-delta", text: " there" },
      { type: "text-delta", text: "!" },
      { type: "finish", reason: "stop" },
    ]);

    await scenario.sendMessage("Hello Motherbase");

    const assistantMessage: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Hi there!" }],
    };

    expect(scenario.events).toEqual([
      { type: "message-in-progress", parts: [{ type: "text", text: "" }] },
      { type: "message-in-progress", parts: [{ type: "text", text: "Hi" }] },
      {
        type: "message-in-progress",
        parts: [{ type: "text", text: "Hi there" }],
      },
      {
        type: "message-in-progress",
        parts: [{ type: "text", text: "Hi there!" }],
      },
      { type: "message-completed", message: assistantMessage },
      { type: "turn-completed" },
    ]);

    expect(scenario.runner.state).toEqual({ type: "idle" });

    expect(scenario.messages).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Hello Motherbase" }],
      },
      assistantMessage,
    ]);
  });

  test("reasoning deltas stream before the text and the completed message keeps the reasoning part", async () => {
    const scenario = new Scenario();

    scenario.scriptTurn([
      { type: "reasoning-start" },
      { type: "reasoning-delta", text: "The user greeted me. " },
      { type: "reasoning-delta", text: "I should greet back." },
      { type: "text-start" },
      { type: "text-delta", text: "Hey" },
      { type: "text-delta", text: "!" },
      { type: "finish", reason: "stop" },
    ]);

    await scenario.sendMessage("Hello again");

    const assistantMessage: MessageEntry = {
      kind: "message",
      role: "assistant",
      parts: [
        {
          type: "reasoning",
          text: "The user greeted me. I should greet back.",
        },
        { type: "text", text: "Hey!" },
      ],
    };

    const reasoning = "The user greeted me. I should greet back.";

    expect(scenario.events).toEqual([
      {
        type: "message-in-progress",
        parts: [{ type: "reasoning", text: "" }],
      },
      {
        type: "message-in-progress",
        parts: [{ type: "reasoning", text: "The user greeted me. " }],
      },
      {
        type: "message-in-progress",
        parts: [{ type: "reasoning", text: reasoning }],
      },
      {
        type: "message-in-progress",
        parts: [
          { type: "reasoning", text: reasoning },
          { type: "text", text: "" },
        ],
      },
      {
        type: "message-in-progress",
        parts: [
          { type: "reasoning", text: reasoning },
          { type: "text", text: "Hey" },
        ],
      },
      {
        type: "message-in-progress",
        parts: [
          { type: "reasoning", text: reasoning },
          { type: "text", text: "Hey!" },
        ],
      },
      { type: "message-completed", message: assistantMessage },
      { type: "turn-completed" },
    ]);

    expect(scenario.messages).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Hello again" }],
      },
      assistantMessage,
    ]);
  });
});
