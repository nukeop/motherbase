import { SessionList } from "@motherbase/ui";
import { useMatch, useNavigate } from "@tanstack/react-router";
import { LuPlus } from "react-icons/lu";
import { useSessions } from "../hooks/useSessions";

export const SessionSidebar = () => {
  const { sessions, createSession } = useSessions();
  const navigate = useNavigate();

  const sessionMatch = useMatch({
    from: "/sessions/$sessionId",
    shouldThrow: false,
  });

  const onSelect = (sessionId: string) => {
    navigate({ to: "/sessions/$sessionId", params: { sessionId } });
  };

  const onCreateSession = () => {
    createSession(undefined, {
      onSuccess: (created) => {
        navigate({ to: "/sessions/$sessionId", params: { sessionId: created.id } });
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        onClick={onCreateSession}
        className="flex items-center gap-2 mx-2 my-2 px-3 py-1.5 font-nav text-xs uppercase tracking-widest text-cream/60 border border-cream/10 cursor-pointer transition-colors hover:text-cream hover:border-cream/25"
      >
        <LuPlus className="size-3.5" />
        New session
      </button>
      <SessionList
        sessions={sessions}
        selectedId={sessionMatch?.params.sessionId}
        onSelect={onSelect}
      />
    </div>
  );
};
