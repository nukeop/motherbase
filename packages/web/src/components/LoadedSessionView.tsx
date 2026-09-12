import type { HistoryEntry, MessagePart } from "@motherbase/core";
import { AssistantMessage, Conversation, PromptInput } from "@motherbase/ui";
import { useModelSelection } from "../hooks/useModelSelection";
import { HistoryEntries } from "./HistoryEntries";

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
        <HistoryEntries sessionId={sessionId} entries={messages} />
        {streamingParts && <AssistantMessage parts={streamingParts} />}
      </Conversation>
      <PromptInput {...modelSelection} onSubmit={sendMessage} />
    </div>
  );
};
