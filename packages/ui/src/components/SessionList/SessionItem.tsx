import type { FC } from "react";
import { cn } from "../../utils";
import { DeleteButton } from "./DeleteButton";
import type { SessionListItem } from "./types";

type SessionItemProps = {
  session: SessionListItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export const SessionItem: FC<SessionItemProps> = ({
  session,
  isSelected,
  onSelect,
  onDelete,
}) => (
  <div
    data-testid={`session-${session.id}`}
    className={cn("group flex items-center border-l-2 transition-colors", {
      "border-orange bg-orange/5": isSelected,
      "border-transparent hover:bg-cream/5": !isSelected,
    })}
  >
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex-1 px-3 py-2 text-left font-nav text-xs uppercase tracking-widest cursor-pointer",
        {
          "text-orange": isSelected,
          "text-cream/60 hover:text-cream": !isSelected,
        },
      )}
    >
      {session.title}
    </button>
    <DeleteButton onClick={onDelete} />
  </div>
);
