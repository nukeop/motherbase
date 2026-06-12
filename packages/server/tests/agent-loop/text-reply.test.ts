import { describe, expect, test } from "bun:test";
import { createScenario } from "../helpers/scenario";

describe("text reply turn", () => {
  test("a sent message streams back a text reply and the session returns to idle", async () => {
    const scenario = createScenario();

    scenario.scriptTurn({
      stream: [
        { type: "text-delta", text: "Hi" },
        { type: "text-delta", text: " there" },
        { type: "text-delta", text: "!" },
      ],
      finish: "stop",
    });

    await scenario.sendMessage("Hello Motherbase");

    const assistantMessage = {
      kind: "message",
      role: "assistant",
      parts: [{ type: "text", text: "Hi there!" }],
    };

    expect(scenario.events).toEqual([
      { type: "text-delta", text: "Hi" },
      { type: "text-delta", text: " there" },
      { type: "text-delta", text: "!" },
      { type: "message-completed", message: assistantMessage },
      { type: "turn-completed" },
    ]);

    expect(scenario.state).toEqual({ type: "idle" });

    expect(scenario.history).toEqual([
      {
        kind: "message",
        role: "user",
        parts: [{ type: "text", text: "Hello Motherbase" }],
      },
      assistantMessage,
    ]);
  });

	test("reasoning deltas stream before the text and the completed message keeps the reasoning part", async () => {
		const scenario = createScenario();

		scenario.scriptTurn({
			stream: [
				{ type: "reasoning-delta", text: "The user greeted me. " },
				{ type: "reasoning-delta", text: "I should greet back." },
				{ type: "text-delta", text: "Hey" },
				{ type: "text-delta", text: "!" },
			],
			finish: "stop",
		});

		await scenario.sendMessage("Hello again");

		const assistantMessage = {
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

		expect(scenario.events).toEqual([
			{ type: "reasoning-delta", text: "The user greeted me. " },
			{ type: "reasoning-delta", text: "I should greet back." },
			{ type: "text-delta", text: "Hey" },
			{ type: "text-delta", text: "!" },
			{ type: "message-completed", message: assistantMessage },
			{ type: "turn-completed" },
		]);

		expect(scenario.history).toEqual([
			{
				kind: "message",
				role: "user",
				parts: [{ type: "text", text: "Hello again" }],
			},
			assistantMessage,
		]);
	});
});
