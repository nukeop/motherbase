import { describe, expect, test } from "bun:test";
import { Scenario } from "../helpers/scenario";

describe("checkpoints", () => {
  test("a fresh session holds a single initial idle checkpoint with a null parent, and head points at it", () => {
    const scenario = new Scenario();

    expect(scenario.session.checkpoints).toEqual([
      {
        id: expect.any(String),
        parentId: null,
        sessionId: scenario.session.id,
        sequence: 0,
        state: { type: "idle" },
        history: [],
      },
    ]);

    expect(scenario.session.head).toBe(scenario.session.checkpoints[0]!.id);
  });

  test("a completed text turn appends a checkpoint holding the full two-message history, descending from the initial checkpoint with an incremented sequence, and head moves to it", async () => {
    const scenario = new Scenario();
    const initialId = scenario.session.checkpoints[0]!.id;

    scenario.scriptTurn([
      { type: "text-delta", text: "Hi" },
      { type: "text-delta", text: " there" },
      { type: "text-delta", text: "!" },
      { type: "finish", reason: "stop" },
    ]);

    await scenario.sendMessage("Hello Motherbase");

    const history = [
      {
        kind: "message" as const,
        role: "user" as const,
        parts: [{ type: "text" as const, text: "Hello Motherbase" }],
      },
      {
        kind: "message" as const,
        role: "assistant" as const,
        parts: [{ type: "text" as const, text: "Hi there!" }],
      },
    ];

    expect(scenario.session.checkpoints).toEqual([
      {
        id: initialId,
        parentId: null,
        sessionId: scenario.session.id,
        sequence: 0,
        state: { type: "idle" },
        history: [],
      },
      {
        id: expect.any(String),
        parentId: initialId,
        sessionId: scenario.session.id,
        sequence: 1,
        state: { type: "idle" },
        history,
      },
    ]);

    expect(scenario.session.head).toBe(scenario.session.checkpoints[1]!.id);
  });
});
