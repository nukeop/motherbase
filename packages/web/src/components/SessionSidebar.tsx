import { SessionList } from "@motherbase/ui";
import { LuPlus } from "react-icons/lu";
import { useSessionActions } from "../hooks/useSessionActions";

export const SessionSidebar = () => {
  const { sessions, selectedId, onSelect, onDelete, onCreate } =
    useSessionActions();

  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        data-testid="create-session"
        onClick={onCreate}
        className="flex items-center gap-2 mx-2 my-2 px-3 py-1.5 font-nav text-xs uppercase tracking-widest text-cream/60 border border-cream/10 cursor-pointer transition-colors hover:text-cream hover:border-cream/25"
      >
        <LuPlus className="size-3.5" />
        New session
      </button>
      <SessionList
        sessions={sessions}
        selectedId={selectedId}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </div>
  );
};
