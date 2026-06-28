import { useSession } from "../hooks/useSession";
import { LoadedSessionView } from "./LoadedSessionView";

type SessionViewProps = {
  sessionId: string;
};

export const SessionView = ({ sessionId }: SessionViewProps) => {
  const { isLoading, session, messages, streamingParts, sendMessage } =
    useSession(sessionId);

  if (isLoading || !session) {
    return null;
  }

  return (
    <LoadedSessionView
      sessionId={sessionId}
      providerId={session.providerId}
      modelId={session.modelId}
      messages={messages}
      streamingParts={streamingParts}
      sendMessage={sendMessage}
    />
  );
};
