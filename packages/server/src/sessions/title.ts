import { type LanguageModel, streamText } from "ai";
import { bus } from "../events";
import { updateSession } from "./store";
import systemPrompt from "./title-prompt.md" with { type: "text" };

type Deps = {
  model: () => Promise<LanguageModel>;
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
  bus.emit(sessionId, "title-updated", { title });
};
