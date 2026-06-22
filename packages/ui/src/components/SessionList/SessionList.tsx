import type { FC } from "react";
import { cn } from "../../utils";

export type SessionListItem = {
  id: string;
  title: string;
};

type SessionListProps = {
  sessions: SessionListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

export const SessionList: FC<SessionListProps> = ({
  sessions,
  selectedId,
  onSelect,
}) => (
  <nav className="flex flex-col overflow-y-auto">
    {sessions.map((session) => {
      const isSelected = session.id === selectedId;
      return (
        <button
          key={session.id}
          type="button"
          onClick={() => onSelect(session.id)}
          className={cn(
            "border-l-2 px-3 py-2 text-left font-nav text-xs uppercase tracking-widest transition-colors cursor-pointer",
            {
              "border-orange bg-orange/5 text-orange": isSelected,
              "border-transparent text-cream/60 hover:bg-cream/5 hover:text-cream":
                !isSelected,
            },
          )}
        >
          {session.title}
        </button>
      );
    })}
  </nav>
);
