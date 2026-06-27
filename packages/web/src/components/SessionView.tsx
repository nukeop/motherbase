import {
  AssistantMessage,
  Conversation,
  PromptInput,
  UserMessage,
} from "@motherbase/ui";
import { useModelSelection } from "../hooks/useModelSelection";
import { useSession } from "../hooks/useSession";

type SessionViewProps = {
  sessionId: string;
};

export const SessionView = ({ sessionId }: SessionViewProps) => {
  const { messages, streamingParts, sendMessage } = useSession(sessionId);
  const modelSelection = useModelSelection();

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <Conversation>
        {messages.map((entry, index) => {
          const key = `${entry.role}-${index}`;
          if (entry.role === "user") {
            return <UserMessage key={key} text={entry.parts[0]!.text} />;
          }
          return <AssistantMessage key={key} parts={entry.parts} />;
        })}
        {streamingParts && <AssistantMessage parts={streamingParts} />}
      </Conversation>
      <PromptInput {...modelSelection} onSubmit={sendMessage} />
    </div>
  );
};
