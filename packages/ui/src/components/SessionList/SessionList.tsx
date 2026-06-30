import type { FC } from "react";
import { SessionItem } from "./SessionItem";
import type { SessionListItem } from "./types";

type SessionListProps = {
  sessions: SessionListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export const SessionList: FC<SessionListProps> = ({
  sessions,
  selectedId,
  onSelect,
  onDelete,
}) => (
  <nav data-testid="session-list" className="flex flex-col overflow-y-auto">
    {sessions.map((session) => (
      <SessionItem
        key={session.id}
        session={session}
        isSelected={session.id === selectedId}
        onSelect={() => onSelect(session.id)}
        onDelete={() => onDelete(session.id)}
      />
    ))}
  </nav>
);
