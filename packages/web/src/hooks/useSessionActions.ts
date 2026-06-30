import { useMatch, useNavigate } from "@tanstack/react-router";
import { useSessions } from "./useSessions";

export const useSessionActions = () => {
  const { sessions, createSession, deleteSession } = useSessions();
  const navigate = useNavigate();

  const sessionMatch = useMatch({
    from: "/sessions/$sessionId",
    shouldThrow: false,
  });

  const selectedId = sessionMatch?.params.sessionId;

  const onSelect = (sessionId: string) => {
    navigate({ to: "/sessions/$sessionId", params: { sessionId } });
  };

  const onDelete = (sessionId: string) => {
    deleteSession(sessionId);
    if (selectedId === sessionId) {
      navigate({ to: "/" });
    }
  };

  const onCreate = () => {
    createSession(undefined, {
      onSuccess: (created) => {
        navigate({
          to: "/sessions/$sessionId",
          params: { sessionId: created.id },
        });
      },
    });
  };

  return { sessions, selectedId, onSelect, onDelete, onCreate };
};
