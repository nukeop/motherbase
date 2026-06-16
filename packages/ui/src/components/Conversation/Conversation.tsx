import type { ReactNode } from "react";

type ConversationProps = {
  children: ReactNode;
};

export const Conversation = ({ children }: ConversationProps) => {
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-cream-dark p-2">
      {children}
    </div>
  );
};
