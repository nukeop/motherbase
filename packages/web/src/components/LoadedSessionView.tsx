import type { HistoryEntry, MessagePart } from "@motherbase/core";
import {
  AssistantMessage,
  Conversation,
  ErrorMessage,
  PromptInput,
  UserMessage,
} from "@motherbase/ui";
import { useModelSelection } from "../hooks/useModelSelection";

const userMessageText = (parts: MessagePart[]): string => {
  const textPart = parts.find((part) => part.type === "text");
  if (textPart === undefined) {
    return "";
  }
  return textPart.text;
};

type LoadedSessionViewProps = {
  sessionId: string;
  providerId: string;
  modelId: string;
  messages: HistoryEntry[];
  streamingParts: MessagePart[] | null;
  sendMessage: (text: string) => void;
};

export const LoadedSessionView = ({
  sessionId,
  providerId,
  modelId,
  messages,
  streamingParts,
  sendMessage,
}: LoadedSessionViewProps) => {
  const modelSelection = useModelSelection(sessionId, providerId, modelId);

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <Conversation>
        {messages.map((entry, index) => {
          if (entry.kind === "error") {
            const key = `error-${index}`;
            return <ErrorMessage key={key} message={entry.message} />;
          }
          if (entry.kind === "tool-result") {
            // Rendered once the tool result block component exists.
            return null;
          }
          const key = `${entry.role}-${index}`;
          if (entry.role === "user") {
            return (
              <UserMessage key={key} text={userMessageText(entry.parts)} />
            );
          }
          return <AssistantMessage key={key} parts={entry.parts} />;
        })}
        {streamingParts && <AssistantMessage parts={streamingParts} />}
      </Conversation>
      <PromptInput {...modelSelection} onSubmit={sendMessage} />
    </div>
  );
};
