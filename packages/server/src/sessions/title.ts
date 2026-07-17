import type { AgentEvent } from "@motherbase/core";
import { type LanguageModel, streamText } from "ai";
import { updateSession } from "./store";
import systemPrompt from "./title-prompt.md" with { type: "text" };

type Deps = {
  model: () => Promise<LanguageModel>;
  emit: (event: AgentEvent) => void;
};

export const generateSessionTitle = async (
  sessionId: string,
  userText: string,
  deps: Deps,
): Promise<void> => {
  const result = streamText({
    model: await deps.model(),
    system: systemPrompt,
    prompt: `Generate a title for this conversation:\n${userText}`,
  });
  const title = (await result.text).trim();

  updateSession(sessionId, { title });
  deps.emit({ type: "title-updated", title });
};
