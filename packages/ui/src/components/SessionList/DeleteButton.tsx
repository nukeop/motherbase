import type { FC } from "react";
import { LuTrash2 } from "react-icons/lu";

type DeleteButtonProps = {
  onClick: () => void;
};

export const DeleteButton: FC<DeleteButtonProps> = ({ onClick }) => (
  <button
    type="button"
    data-testid="delete-session"
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
    className="px-2 py-2 text-cream/30 opacity-0 transition-opacity cursor-pointer group-hover:opacity-100 hover:text-red"
  >
    <LuTrash2 size={14} />
  </button>
);
